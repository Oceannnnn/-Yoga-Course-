// pages/comment/comment.js
const app = getApp();
const util = require('../../utils/util.js')
var count = 0;
Page({
  data: {
    satisfied:1,
    radio: [{
        name: '1',
        value: '满意',
        checked: 'true'
      },
      {
        name: '0',
        value: '不满意'
      },
    ],
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/no-star.png',
    selectedSrc: '../../images/full-star.png',
    halfSrc: '../../images/half-star.png',
    key: 0, //评分
    stars_fen: "请打分"
  },
  onLoad(op) {
    this.setData({
      id: op.id
    })
  },
  //点击左边,半颗星
  selectLeft(e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key,
      stars_fen: key + "分"
    })
  },
  //点击右边,整颗星
  selectRight(e) {
    var key = e.currentTarget.dataset.key
    count = key
    this.setData({
      key: key,
      stars_fen: key + "分"
    })
  },
  bindinput(e) {
    this.setData({
      evaluate: e.detail.value,
    })
  },
  radioChange(e) {
    this.setData({
      satisfied: e.detail.value,
    })
  },
  bindtap() {
    var evaluate = this.data.evaluate,
      score = this.data.key,
      satisfied = this.data.satisfied,
      order_id = this.data.id;
    if (!evaluate) {
      wx.showToast({
        title: '请输入评价',
        icon: 'none'
      })
      return
    }
    if (score == 0) {
      wx.showToast({
        title: '请打分',
        icon: 'none'
      })
      return
    }
    let token = app.globalData.token;
    let json = {
      evaluate: evaluate,
      score: score,
      satisfied: satisfied,
      order_id: order_id
    }
    util.http("evaluate/evaluateAdd", json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index',
          })
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