var app = getApp()
Page({
  data: {
    stars: [1, 2, 3, 4, 5],
    goodDescribe: 0,
    serverAttitude: 0,
    logisService: 0,
    addImgSrc: [],
    pictures: [],
    order_code: '',// 订单编号
    productInfo: {}, // 商品信息    
  },
  onLoad: function (options) {
    let that = this;
    let id = options.id; //订单id       
    wx.request({
      url: app.globalData.api + 'order/getOrderDetail',
      data: {
        order_id: id
      },
      method: 'POST',
      success: function (res) {
        let order_code = res.data.data.order_code; // 订单编号
        let productInfo = res.data.data.products;
        if (options.proid) {
          var index = options.index
          productInfo = productInfo[index]
        } else {
          productInfo = productInfo[0]
        }
        that.setData({
          productInfo,
          order_code
        })
      }
    })
  },
  // 星级选中
  onCommentStar(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if (id == 'gd') {
      this.setData({
        goodDescribe: index
      })
    } else if (id == 'sa') {
      this.setData({
        serverAttitude: index
      })
    } else {
      this.setData({
        logisService: index
      })
    }
  },
  // 添加图片
  addPic() {
    var that = this;
    var addImgSrc = that.data.addImgSrc;
    var pictures = that.data.pictures;

    wx.chooseImage({
      count: 5,
      success: function (res) {

        let temp = res.tempFilePaths;
        addImgSrc = JSON.parse(JSON.stringify(temp))

        // console.log(addImgSrc)

        // for (var i = 0; i < addImgSrc.length; i++) {
        //   wx.uploadFile({
        //     url: 'https://mps.essocial.com.cn/backend/common/upload',
        //     filePath: addImgSrc[i],
        //     name: 'image',
        //     success: function (res) {
        //       var pic = res.data;
        //       pictures.push(pic)

        //     }
        //   })
        // }
        const pro = addImgSrc.map((item, index) => {

          return new Promise((resolve, reject) => {

            wx.uploadFile({
              url: 'https://mps.essocial.com.cn/backend/common/upload',
              filePath: item,
              name: 'image',
              success: function (res) {
                // var pic = res.data;
                // pictures.push(pic)

                resolve(res)
              }
            })

          })

        })

        // console.log(pictures)
        Promise.all(pro).then(function (res) {
         
          res.map(item => {
            pictures.push(item.data)
          })
          console.log(pictures)

          that.setData({
            addImgSrc,
            pictures
          })
          // var pic = res.data;
          // pictures.push(pic)
        })

       

        

      }
    })

  },
  // 发布评论
  publishComment(e) {
    let that = this;
    let customer_id = wx.getStorageSync('c_id');
    let order_code = that.data.order_code;
    let target_id = that.data.productInfo.order_product_id;
    let option = that.data.productInfo.option;
    let description_level = that.data.goodDescribe;
    let service_level = that.data.serverAttitude;
    let logistics_level = that.data.logisService;
    let description = e.detail.value.textarea;
    let picture = that.data.pictures;

    wx.request({
      url: app.globalData.api + 'comment/addComment',
      data: {
        program_id: 2,
        customer_id,
        order_code,
        description,
        target_id,
        option,
        description_level,
        service_level,
        logistics_level,
        picture //图片
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status) {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  }
})
