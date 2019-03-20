// pages/courseRelease/courseRelease.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    date: "2019-01-01",
    s_time: "00:00",
    st_imgbox: [],
    st_pic: '',
    imgbox: [],
    image: {}
  },
  onLoad() {

  },
  delImage(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
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
    let token = app.globalData.token;
    let box = [];
    if (n == 1) {
      box = this.data.st_imgbox
    } else if (n == 9) {
      let imgbox = this.data.imgbox
      box = imgbox;
      if (box == '') {
        box = []
      }
    }
    let image = this.data.image;
    for (var i = 0; i < arr.length; i++) {
      var that = this;
      wx.uploadFile({
        url: util.u + "upload/upload",
        filePath: arr[i],
        name: 'file[]', //这里根据自己的实际情况改,
        formData: {},
        header: {
          "Content-Type": "multipart/form-data",
          token: token
        }, //这里是上传图片时一起上传的数据
        complete: (res) => {
          i++; //这个图片执行完上传后，开始上传下一张
          let data = res.data;
          data = JSON.parse(data);
          let url = data.data;
          image['image'] = url;
          box.push(image);
          image = {}
          if (n == 1) {
            that.setData({
              st_imgbox: [],
              st_imgbox: box,
              st_pic: box[0].image
            });
          } else if (n == 9) {
            that.setData({
              imgbox: box
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
  bindTimeChange(e) {
    this.setData({
      s_time: e.detail.value,
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindName(e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindDuration(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  bindContent(e) {
    this.setData({
      c_content: e.detail.value
    })
  },
  bindPrice(e) {
    this.setData({
      price: e.detail.value
    })
  },
  bindNum(e) {
    this.setData({
      num: e.detail.value
    })
  },
  bindtap() {
    let stime = this.data.date + " " + this.data.s_time;
    var number = this.data.num,
      price = this.data.price,
      c_content = this.data.c_content,
      title = this.data.title,
      duration = this.data.duration,
      c_thumb = this.data.st_pic,
      imgbox = this.data.imgbox;
    let token = app.globalData.token;
    if (c_thumb == '') {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    if (!title) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return
    }
    if (imgbox == '') {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    if (!duration) {
      wx.showToast({
        title: '请输入时长',
        icon: 'none'
      })
      return
    }
    if (!c_content) {
      wx.showToast({
        title: '请输入介绍',
        icon: 'none'
      })
      return
    }
    if (!price) {
      wx.showToast({
        title: '请输入费用',
        icon: 'none'
      })
      return
    }
    if (!number) {
      wx.showToast({
        title: '请输入人数',
        icon: 'none'
      })
      return
    }
    imgbox = JSON.stringify(imgbox);
    let json = {
      number: number,
      price: price,
      c_content: c_content,
      title: title,
      duration: duration,
      c_thumb: c_thumb,
      stime: stime,
      imgBox: imgbox
    }
    util.http('course/courseAdd', json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: "发布成功",
          icon: "success"
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 1000)
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        })
      }
    })
  }
})