// pages/comments/comments.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    page: 1,
    onBottom: true,
    list: []
  },
  onLoad(op) {
    this.setData({
      id:op.id
    })
    this.list(1)
  },
  list(page) {
    let json = {
      size: 10,
      page: page,
      id:this.data.id
    }
    let list = this.data.list;
    let token = app.globalData.token;
    util.http('evaluate/evaluateList', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            list: list
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
      this.list(page);
    }
  },
})