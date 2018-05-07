 

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
    var skey = wx.getStorageSync('skey')
    wx.checkSession({
      success: function (res) {
        // console.log('skey未过期');
        // wx.showModal({           
        //   content: '欢迎回来',
        //   showCancel:false
        // })
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
                  // 登录有效期skey
                  wx.setStorageSync('skey', res.data.data.skey)
                  // 用户id
                  wx.setStorageSync('c_id', res.data.data.customer_id)

                  // openid
                  // wx.setStorageSync('open_id', res.data.data.openid)

                  wx.showModal({
                    title: '提示',
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

