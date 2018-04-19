 App({

  globalData: {

  },
  onLaunch: function () {
    this.login();
  },
  onShow: function (options) {
    
  },
  // 登录
  login: function () {
    // https://juejin.im/post/5ac9b72cf265da23906c486a    
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
              console.log(res)
              wx.request({
                url: 'http://mps.essocial.com.cn/api/login/login',
                data: {
                  code: res.code,
                  program_id: 1
                },
                method: 'POST',
                success: function (res) {
                  wx.setStorageSync('skey', res.data.data.skey)
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

