 var MD5Util = require('../../utils/MD5Encode.js');
Page({
  data: {
    stateItem: [
      '全部', '待付款', '待发货', '待收货', '已完成'
    ],
    currentState: 0,
    orderListData: [],
    // key : ''
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
          // let key = res.data.key;
          console.log(orderListData)
          that.setData({
            currentState: state,
            orderListData,
            // key
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
          // let key = res.data.key;
          console.log(orderListData)
          that.setData({
            orderListData,
            // key
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
  },
  // 支付
  toPayNow(e) {
    let that = this;
    let total_fee = e.currentTarget.dataset.ic;
    let order_code = e.currentTarget.dataset.oc;
    let openId = wx.getStorageSync('open_id');

    wx.request({
      url: 'http://mps.essocial.com.cn/api/checkout/pay',
      method: 'POST',
      data: {
        openId,
        total_fee,
        order_code
      },
      success: function (res) {

        console.log(res)

        let appid = wx.getStorageSync('app_id')// 

        // 时间戳 timestamp
        var date = new Date()
        var timeStamp = date.getTime().toString().substr(0, 10)

        // 随机字符串
        let nonceArr = []
        let rd = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (var i = 0; i < 32; i++) {
          var tempIndex = Math.floor(Math.random() * 32)
          nonceArr.push(rd[tempIndex])
        }
        var nonceStr = nonceArr.join('')

        // 数据包 package
        var packageA = 'prepay_id=' + prepay_id;
        // 签名 paySign                
        var stringA = `appId=${appid}&nonceStr=${nonceStr}&package=${packageA}&signType=MD5&timeStamp=${timeStamp}`;
        var stringSignTemp = `${stringA}&key=${this.data.key}`;
        var sign = MD5Util.hexMD5(stringSignTemp).toUpperCase();

        // 发起微信支付
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': packageA,
          'signType': 'MD5',
          'paySign': sign,
          'success': function (res) {
            console.log(res)
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            })
          },
          'fail': function (res) {
            console.log(res)
          }
        })

      }
    })





  }
})
