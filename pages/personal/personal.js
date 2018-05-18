 var app = getApp();
Page({
  data: {
    hasLogin: false,
    name: '',
    avatar: '',
    gender: '',
    count : [] // 各类订单数
  },
  onLoad: function (options) {
    var that = this;
    var c_id = wx.getStorageSync('c_id');
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.request({
            url: 'http://mps.essocial.com.cn/api/customer/getCustomerDetail',
            data: {
              customer_id: c_id
            },
            method: 'POST',
            success: function (res) {               
              let name = res.data.data.name;
              let avatar = res.data.data.avatar;
              let deposit = res.data.data.deposit;
              let count = res.data.count
              console.log(res)
              that.setData({
                hasLogin: true,
                avatar,
                name,
                deposit,
                count             
              })
            }
          })
        }
      }
    })
  },
  // 点击主动获取用户信息
  onBindgetuserinfo(res) {
    var c_id = wx.getStorageSync('c_id');
    // 是否同意授权
    if (res.detail.userInfo) {
      let userInfo = res.detail.userInfo;
      let name = userInfo.nickName;
      let avatar = userInfo.avatarUrl;
      let gender = userInfo.gender;
      this.setData({
        hasLogin: true,
        name,
        avatar
      })
      wx.request({
        url: 'http://mps.essocial.com.cn/api/customer/editCustomer',
        data: {
          customer_id: c_id,
          name,
          avatar,
          gender
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
        }
      })
    }
  }
})
