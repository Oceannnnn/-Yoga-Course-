// pages/appointmentDetails/appointmentDetails.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {

  },
  onLoad(op) {
    this.setData({
      type: op.type //0用户，1教师，2购买详情
    })
    let url = "";
    if (op.type == 2) {
      url = "distributor/orderInfo"
    } else if (op.type == 0) {
      url = "order/info"
    } else if (op.type == 0) {
      url = "teacher/orderInfo"
    }
    util.http(url, {
      id: op.id
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          info: res.data
        })
      }
    })
  }
})