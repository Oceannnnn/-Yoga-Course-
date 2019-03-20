// pages/teacher/teacher.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    page: 1,
    onBottom: true,
    teacher: []
  },
  onLoad() {
    this.teacher(1);
  },
  teacher(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.teacher;
    let token = app.globalData.token;
    util.http('teacher/recommendList', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            teacher: list
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
      this.teacher(page)
    }
  },
  bindtap(e) {
    util.toDetails(e, "teacherDetails")
  }
})