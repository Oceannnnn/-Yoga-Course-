// pages/managementTeacher/managementTeacher.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    page: 1,
    onBottom: true,
    management: []
  },
  onLoad() {
    this.management(1);
  },
  management(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.management;
    let token = app.globalData.token;
    util.http('store/teacherList', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            management: list
          })
        } else {
          if (page > 1) {
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
      this.management(page)
    }
  },
  bindtap(e) {
    util.toDetails(e, "teacherDetails")
  },
  delete(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let newList = this.data.management;
    let token = app.globalData.token;
    util.http('store/teacherDel', {
      id: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        newList.splice(index, 1);
        this.setData({
          management: newList
        })
      } else {
        wx.showToast({
          title: "删除失败",
          icon: "none",
          duration: 500
        })
      }
    })
  },
})