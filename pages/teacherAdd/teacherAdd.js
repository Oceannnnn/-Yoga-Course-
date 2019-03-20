// pages/teacherAdd/teacherAdd.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    addName: "捆绑账号",
    placeholder: "请输入账号",
    foot: "确定捆绑",
    type: 1
  },
  onLoad(op) {
    if (op.type == 2) {
      wx.setNavigationBarTitle({
        title: '添加推广员',
      })
      this.setData({
        addName: "ID",
        placeholder: "请输入ID",
        foot: "确定添加",
        type: op.type
      })
    }
  },
  bindNumber(e) {
    this.setData({
      number: e.detail.value,
    })
  },
  bindtap() {
    let type = this.data.type;
    var number = this.data.number;
    let title = "请输入账号";
    let url = "store/teacherAdd";
    if (type == 2) {
      title = "请输入ID";
      url = "store/storeAdmin";
    }
    if (!number) {
      wx.showToast({
        title: title,
        icon: 'none'
      })
      return
    }
    let json = {
      id: number,
    }
    let token = app.globalData.token;
    util.http(url, json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})