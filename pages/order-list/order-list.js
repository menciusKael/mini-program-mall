Page({
  data: {
    stateItem: [
      '全部', '待付款', '待发货', '待收货', '已完成'
    ],
    currentState: 0,
    orderListData: []
  },

  onLoad: function (options) {
    var that = this;
    var c_id = wx.getStorageSync('c_id');
    if (options) {
      var state = options.state;
      wx.request({
        url: 'http://mps.essocial.com.cn/api/order/getOrderList',
        data: {
          customer_id: c_id,
          status: state
        },
        method: 'POST',
        success: function (res) {
          let orderListData = res.data.data;
          console.log(orderListData)
          that.setData({
            currentState: state,
            orderListData
          })
        }
      })
    } else {
      wx.request({
        url: 'http://mps.essocial.com.cn/api/order/getOrderList',
        data: {
          customer_id: c_id,
          status: that.data.currentState
        },
        method: 'POST',
        success: function (res) {
          let orderListData = res.data.data;
          console.log(orderListData)
          that.setData({
            orderListData
          })
        }
      })
    }
  },

  onStateTap: function (e) {
    let index = e.currentTarget.dataset.index;// 0,1,2,3,4 全部=>待评价    
    this.setData({
      currentState: index
    })
    this.onLoad()
  },
  // 删除订单
  onDeleteOrder(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    console.log(index)
    wx.showModal({
      title: '提示',
      content: '确定删除此订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'http://mps.essocial.com.cn/api/order/deleteOrder',
            method: 'POST',
            data: {
              order_id: id
            },
            success: function (res) {
              if (res.data.status) {
                let orderListData = that.data.orderListData;
                orderListData.splice(index, 1);
                that.setData({
                  orderListData
                })
              }
            }
          })
        }
      }
    })
  },
  // 订单详情
  onOrderDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?id=' + id,
    })
  },
  // 去评论
  onComment(e) {
    let id = e.currentTarget.dataset.id;// 订单id
    let proNum = e.currentTarget.dataset.pronum; 
     
    // 单个商品直接去评价页面
    if (proNum == 1) {
      wx.navigateTo({
        url: '/pages/comment/comment-confirm/comment-confirm?id=' + id  
      })
    } else {
      // 否则去商品选择评价页面
      wx.navigateTo({
        url: '/pages/comment/comment?id=' + id
      })
    }
  },
  // 申请退款
  onApplyReturn(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/return/return?id=' + id,
    })
  }
})