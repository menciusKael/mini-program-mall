Page({
  data: {
    stars: [1, 2, 3, 4, 5],
    goodDescribe: 0,
    serverAttitude: 0,
    logisService: 0,
    addImgSrc: [],
    order_code: '',// 订单编号
    productInfo: {}, // 商品信息    
  },
  onLoad: function (options) {
    let that = this;
    let id = options.id; //订单id       
    wx.request({
      url: 'http://mps.essocial.com.cn/api/order/getOrderDetail',
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
    wx.chooseImage({
      count: 5,
      success: function (res) {
        that.setData({
          addImgSrc: res.tempFilePaths
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
    let picture = that.data.addImgSrc;
    wx.request({
      url: 'http://mps.essocial.com.cn/api/comment/addComment',
      data: {
        program_id: 1,
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
         if(res.data.status){
           wx.showToast({
             title: '评论成功',
             icon:'success',
             duration:2000              
           })
         }
      }
    })
  }
})