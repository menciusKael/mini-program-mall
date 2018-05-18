Page({
  data: {

  },

  onLoad: function (options) {
    let that = this;
    let id = options.id;
    wx.request({
      url: 'http://mps.essocial.com.cn/api/order/getOrderDetail',
      method: 'POST',
      data: {
        order_id: id
      },
      success: function (res) {
         let orderDetailData = res.data.data
         console.log(orderDetailData)
         that.setData({
           orderDetailData
         })
      }
    })
  },

})