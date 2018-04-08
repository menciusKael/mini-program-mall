//app.js
App({
  // App() 必须在 app.js 中注册，且不能注册多个。
  // 不要在定义于 App() 内的函数中调用 getApp() ，使用 this 就可以拿到 app 实例。
  // 不要在 onLaunch 的时候调用 getCurrentPages() ，此时 page 还没有生成。
  // 通过 getApp() 获取实例之后，不要私自调用生命周期函数。
  // 全局数据可以在此处设置，然后通过 let app = getApp() 可以在其他页面获取
  globalData: {
    userInfo: null
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

    // 本地存储登录次数及时间
    // 同步获取本地存储，第一次为空
    // let logs = wx.getStorageSync('logs') || [];
    // // wx.setStorageSync('logs', Date.now()); // 这样会 重写！
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);

    // 登录
    // wx.login({
    //   success : res => {
    //      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     //  code 为临时登录凭证，有效期为五分钟、类型为String
    //      if(res.code){
    //         wx.request({
    //           url: '',
    //           data : {
    //             code : res.code // ???
    //           }
    //         })
    //      }else{
    //        console.log('登录失败！稍后重试！')
    //      }
    //   } 
    // })  


    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
