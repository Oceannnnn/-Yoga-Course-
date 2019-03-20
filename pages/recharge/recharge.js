// pages/recharge/recharge.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    parameter: [],
    disabled: false,
    money: ''
  },
  onLoad() {
    this.init();
  },
  parameterTap(e) {
    var this_checked = e.currentTarget.dataset.id
    var parameterList = this.data.parameter
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].id == this_checked) {
        parameterList[i].status = 1;
      } else {
        parameterList[i].status = 0; //其他的位置为false
      }
    }
    this.setData({
      parameter: parameterList,
      id: this_checked,
      money: ''
    })
  },
  goRecharge() {
    let id = "";
    let parameterList = this.data.parameter
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].status == 1) {
        id = parseInt(parameterList[i].id);
      }
    }
    let money = this.data.money;
    if (money != "" && money < 1) {
      wx.showToast({
        title: '最少充值1元',
        icon: 'none'
      })
      return
    }
    this.setData({
      disabled: true
    })
    let token = app.globalData.token;
    util.http('recharge/rechargeAdd', {
      id: id,
      money: money
    }, 'post', token).then(res => {
      if (res.code == 200) {
        this.pay(token, res.data)
      }
    })
  },
  pay(token, id) {
    var that = this;
    util.http('pay/recharge', {
      order_no: id
    }, 'post', token).then(res => {
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': res.signType,
        'paySign': res.paySign,
        'success': function(res) {
          that.setData({
            disabled: false
          })
          this.member(); //更新余额
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000,
            success: function() {
              setTimeout(() => {
                wx.navigateBack()
              }, 500)
            }
          })
        },
        'fail': function(res) {
          that.setData({
            disabled: false
          })
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    })
  },
  member() {
    let token = app.globalData.token;
    util.http('member/info', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          member: res.data.balance
        })
        app.globalData.member = res.data.balance;
        wx.setStorage({
          key: "member",
          data: res.data.balance
        })
      }
    })
  },
  bindinput(e) {
    let parameterList = this.data.parameter
    for (var i = 0; i < parameterList.length; i++) {
      parameterList[i].status = 0;
    }
    this.setData({
      parameter: parameterList,
      money: e.detail.value,
      id: ''
    })
  },
  init() {
    util.http('recharge/index', {}, 'get').then(res => {
      this.setData({
        parameter: res.data.info,
        is_presenter: res.data.is_presenter
      })
    })
  }
})