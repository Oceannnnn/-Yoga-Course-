// pages/teacherDetails/teacherDetails.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    active: 1
  },
  onLoad(op) {
    util.http('teacher/info', { id: op.id}, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          teacherInfo: res.data.teacherInfo,
          teacherCourse: res.data.teacherCourse,
          teacherEvaluate: res.data.teacherEvaluate,
        })
      }
    })

  },
  bindTeacher(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      active: id
    })
  }
})