// pages/team/team.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    team: [],
    page: 1,
    onBottom: true
  },
  onLoad() {
    this.team(1)
  },
  team(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.team;
    let token = app.globalData.token;
    util.http('distributor/team', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            team: list
          })
        } else {
          if (page > 1) {
            wx.showToast({
              title: '没有数据啦！',
              icon: 'none',
              duration: 2000
            })
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.team(page);
    }
  },
  recordPurchase(e){
    util.toDetails(e,"recordPurchase")
  }
})