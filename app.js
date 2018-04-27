

App({
  // 全局数据
  globalData: {
   
  },
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function () {
    this.login()
  },
  // 登录
  login: function () {
    var that = this;
    var skey = wx.getStorageInfoSync('skey');
    wx.checkSession({
      success: function () {
        console.log('skey未过期');
      },
      fail: function () {
        console.log('skey已失效');
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.request({
                url: 'http://mps.essocial.com.cn/api/login/login',
                data: {
                  code: res.code,
                  program_id: 1
                },
                method: 'POST',
                success: function (res) {
                  console.log(res)
                  
                  wx.setStorageSync('skey', res.data.data.skey)

                  that.globalData.customer_id = res.data.data.customer_id;
                  that.globalData.oId = res.data.data.openid;
                  that.globalData.skey = res.data.data.skey
                  
                  wx.showModal({
                    title: '提 示',
                    content: '登录成功！',
                    showCancel: false
                  })
                }
              })
            }
          }
        })
      }
    })
  }

})

