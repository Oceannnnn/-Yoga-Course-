// pages/store/store.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    manList: [{}]
  },
  onLoad(op) {
    util.http('store/info', {
      id: op.id
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          info: res.data,
          storeInfo: res.data.storeInfo
        })
        wx.setNavigationBarTitle({
          title: res.data.storeInfo.store_name,
        })
      }
    })

  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let arr = e.currentTarget.dataset.arr;
    let type = e.currentTarget.dataset.type;
    let imgArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (type == 0) {
        imgArr.push(arr[i].image)
      } else {
        imgArr.push(arr[i].img_url)
      }
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址 
      urls: imgArr, //所有要预览的图片的地址集合 数组形式 
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  manList(e) {
    util.toDetails(e, "teacherDetails")
  },
  go(e) {
    let lng = e.currentTarget.dataset.lng;
    let lat = e.currentTarget.dataset.lat;
    let name = e.currentTarget.dataset.name;
    let address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      name: name,
      address: address,
      scale: 15
    })
  }
})