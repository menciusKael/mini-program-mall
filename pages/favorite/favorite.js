Page({
  data: {
    collectProData: [],
    haveCollect: false
  },
  onShow: function (options) {
    let that = this;
    let c_id = wx.getStorageSync('c_id');
    wx.request({
      url: 'https://mps.essocial.com.cn/api/product_collected/getProductCollectedList',
      data: {
        customer_id: c_id,
        program_type: 3
      },
      method: 'POST',
      success: function (res) {
        let collectProData = res.data.data;
        console.log(collectProData)
        if (collectProData !== null) {
          that.setData({
            collectProData,
            haveCollect: true
          })
        }else{
          that.setData({
            haveCollect: false
          })
        }

      }
    })
  },
  toProductDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/vProductList-detail/vProductList-detail?id=' + id,
    })
  }
})
