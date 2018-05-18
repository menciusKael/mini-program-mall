Page({
  data: {
    returnProData: [],
    order_code: '' // 订单编号
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    wx.request({
      url: 'http://mps.essocial.com.cn/api/order/getOrderDetail',
      data: {
        order_id: id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.status) {
          that.setData({
            returnProData: res.data.data.products, 
            order_code: res.data.data.order_code
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 去确认退货页面
  toReturnConfirm(e) {
    let id = e.currentTarget.dataset.id;// 商品id  
    let pic = e.currentTarget.dataset.pic;
    let name = e.currentTarget.dataset.name;
    let option = e.currentTarget.dataset.option;
    let price = e.currentTarget.dataset.price;
    let amount = e.currentTarget.dataset.amount;
    let code = this.data.order_code;
    let returnProInfo = {
      id,
      pic,
      name,
      option,
      price,
      amount,
      code
    }
    returnProInfo = JSON.stringify(returnProInfo)
    wx.navigateTo({
      url: './return-confirm/return-confirm?returnProInfo=' + returnProInfo
    })
  }
})