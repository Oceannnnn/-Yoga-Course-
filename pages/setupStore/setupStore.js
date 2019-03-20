// pages/setupStore/setupStore.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    s_time: "00:00",
    e_time: "23:59",
    st_pic: '',
    st_imgbox: [],
    imgbox: [],
    image: {}
  },
  onLoad(op) {
    this.init()
  },
  init() {
    let token = app.globalData.token;
    util.http("store/storeEdit", {}, 'get', token).then(res => {
      if (res.code == 200) {
        let data = res.data;
        if (data == "") return
        this.setData({
          imgbox: data.imgBox,
          s_time: data.open_time,
          e_time: data.end_time,
          st_pic: data.s_thumb,
          shop_title: data.store_name,
          id: data.id
        })
      }
    })
  },
  delImage(e) {
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1);
    this.setData({
      imgbox: imgbox
    });
  },
  upload(e) {
    let that = this;
    let n = e.currentTarget.dataset.count;
    wx.chooseImage({
      count: n, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePat
        let tempFilePaths = res.tempFilePaths;
        that.uploadimg(tempFilePaths, n);
      }
    })
  },
  uploadimg(arr, n) {
    let box = [];
    let url = "upload/uploads";
    if (n == 1) {
      box = this.data.st_imgbox;
    } else if (n == 9) {
      let imgbox = this.data.imgbox
      box = imgbox;
      if (box == '') {
        box = []
      }
    }
    let image = this.data.image;
    let timestamp = Date.parse(new Date());
    let post_data = util.makeSign(timestamp);
    post_data = JSON.stringify(post_data);
    let token = app.globalData.token;
    for (var i = 0; i < arr.length; i++) {
      var that = this;
      wx.uploadFile({
        url: util.u + url,
        filePath: arr[i],
        name: 'file[]', //这里根据自己的实际情况改,
        formData: {},
        header: {
          "Content-Type": "multipart/form-data",
          'post-data': post_data,
          token: token
        }, //这里是上传图片时一起上传的数据
        complete: (res) => {
          i++; //这个图片执行完上传后，开始上传下一张
          let data = res.data;
          data = JSON.parse(data);
          let url = data.data;
          image['image'] = url;
          box.push(image);
          image = {};
          if (n == 1) {
            that.setData({
              st_imgbox: [],
              st_imgbox: box,
              st_pic: box[0].image
            });
          } else if (n == 9) {
            that.setData({
              imgbox: box,
              image: {}
            });
          }
          if (i >= arr.length) { //当图片传完时，停止调用    
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })
            return
          } else { //若图片还没有传完，则继续调用函数
            that.uploadimg(arr);
          }
        }
      });
    }
  }, // 时间段选择  
  bindDateChange(e) {
    this.setData({
      s_time: e.detail.value,
    })
  },
  bindDateChange2(e) {
    this.setData({
      e_time: e.detail.value,
    })
  },
  bindName(e) {
    this.setData({
      shop_title: e.detail.value,
    })
  },
  bindtap() {
    var shop_title = this.data.shop_title,
      carousel = this.data.imgbox,
      s_time = this.data.s_time,
      e_time = this.data.e_time,
      indeximg = this.data.st_pic;
    if (!shop_title) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return
    }
    if (indeximg == '') {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    if (carousel == '') {
      wx.showToast({
        title: '请上传店铺图片',
        icon: 'none'
      })
      return
    }
    carousel = JSON.stringify(carousel);
    let token = app.globalData.token;
    let json = {
      store_name: shop_title,
      imgBox: carousel,
      open_time: s_time,
      end_time: e_time,
      s_thumb: indeximg,
      id: id
    }
    util.http("store/storeEdit", json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
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