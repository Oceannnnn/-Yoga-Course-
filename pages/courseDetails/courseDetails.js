// pages/courseDetails/courseDetails.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    imgUrls: [{}, {}],
  },
  onLoad(op) {
    util.http('course/info', {
      id: op.id
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          info: res.data
        })
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
      }
    })
  },
  bindtapStore(e) {
    util.toDetails(e, "store")
  },
  appointment(e) {
    var that = this;
    let state = app.globalData.state;
    if (state == 0) {
      wx.showToast({
        title: '请先登录！',
        icon: "none"
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../my/my'
        })
      }, 500)
      return
    }
    let id = e.currentTarget.dataset.id;
    let member = '余额支付' + "(" + app.globalData.member + "元)";
    wx.showActionSheet({
      itemList: [member, '微信支付'],
      success(res) {
        let tapIndex = res.tapIndex + 1; //1是余额，2是微信 
        let token = app.globalData.token;
        util.http('order/orderAdd', {
          pay_type: tapIndex,
          id: id
        }, 'post', token).then(res => {
          if (res.code == 200) {
            let order_no = res.data.order_no;
            if (tapIndex == 1) {
              that.balance(order_no);
            } else {
              that.wechat(order_no);
            }
          }
        })
      }
    })
  },
  wechat(order_no) {
    let token = app.globalData.token;
    var that = this;
    util.http('pay/wechat', {
      order_no: order_no
    }, 'post', token).then(res => {
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': res.signType,
        'paySign': res.paySign,
        'success': function(res) {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000,
            success: function() {
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 500)
            }
          })
        },
        'fail': function(res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    })
  },
  balance(order_no) {
    let token = app.globalData.token;
    util.http('pay/balance', {
      order_no: order_no
    }, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1000,
          success: function() {
            setTimeout(() => {
              wx.switchTab({
                url: '../index/index',
              })
            }, 500)
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})