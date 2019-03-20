const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    page: 1,
    onBottom: true,
    appointment: []
  },
  onLoad(op) {
    this.setData({
      id: op.id
    })
    this.appointment(1)
  },
  bindDetails(e) {
    util.toDetails(e, "appointmentDetails")
  },
  appointment(page) {
    let json = {
      size: 10,
      page: page,
      id: this.data.id
    }
    let list = this.data.appointment;
    let token = app.globalData.token;
    util.http('distributor/orderList', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            appointment: list
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
      this.appointment(page);
    }
  },
})