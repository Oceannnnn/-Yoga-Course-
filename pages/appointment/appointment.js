// pages/appointment/appointment.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    state: 0,
  },
  onLoad: function(options) {},
  onShow() {
    this.init()
  },
  init() {
    this.setData({
      page: 1,
      onBottom: true,
      appointment: [],
      state: app.globalData.state
    })
    if (app.globalData.state != 1) return;
    this.appointment(1)
  },
  delete(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let len = e.currentTarget.dataset.len;
    let appointment = this.data.appointment;
    let token = app.globalData.token;
    if (len == 1) {
      appointment = []
    }
    this.setData({
      appointment: appointment
    })
    util.http('order/del', {
      id: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        appointment.splice(index, 1);
        this.setData({
          appointment: appointment
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 500
        })
      }
    })
  },
  bindDetails(e) {
    util.toDetails(e, "appointmentDetails")
  },
  appointment(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.appointment;
    let token = app.globalData.token;
    util.http('order/orderList', json, 'post', token).then(res => {
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
  comment(e) {
    util.toDetails(e, "comment")
  },
  pay(e) {
    let id = e.currentTarget.dataset.id;
    // let member = '余额支付' + "(" + app.globalData.member + "元)";
    // wx.showActionSheet({
    //   itemList: [member, '微信支付'],
    //   success(res) {
    //     let tapIndex = res.tapIndex;
    //     if (tapIndex == 0) {

    //     } else {

    //     }
    //   }
    // })
  }
})