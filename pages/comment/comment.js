Page({
  data: {
    commentProData: []
  },
  onLoad: function (options) {
    let that = this;
    let id = options.id; // 订单id
    wx.request({
      url: 'http://mps.essocial.com.cn/api/order/getOrderDetail',
      data: {
        order_id: id
      },
      method: 'POST',
      success: function (res) {
        let commentProData = res.data.data.products;
        console.log(commentProData)
        that.setData({
          commentProData
        })
      }
    })
  },
  // 去评价
  toCommentConfirm(e) {
    let id = e.currentTarget.dataset.id;
    let proid = e.currentTarget.dataset.proid;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/comment/comment-confirm/comment-confirm?id=' + id + '&proid=' + proid + '&index=' + index
    })
  }
})