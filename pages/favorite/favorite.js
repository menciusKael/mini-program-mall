Page({
  data: {
    collectProData : []
  },
  onLoad: function (options) {
    let that = this;
    let c_id = wx.getStorageSync('c_id');
    wx.request({
      url: 'http://mps.essocial.com.cn/api/product_collected/getProductCollectedList',
      data: {
        customer_id: c_id,
        program_type: 3
      },
      method: 'POST',
      success: function (res) {
        let collectProData = res.data.data;
        console.log(collectProData)
        that.setData({
          collectProData
        })
      }
    })
  }
})