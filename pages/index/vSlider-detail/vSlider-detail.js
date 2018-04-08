// pages/index/swiper-detail/swiper-detail.js
var mock = require("../../../utils/mock.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 分享
  onshare(event) {
    let itemList = [
      '分享给微信好友',
      '分享到微信朋友圈',
      '分享到QQ空间',
      '分享给QQ好友',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList,
      success: function (res) {
        let idx = res.tapIndex;
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let newsData = mock.swiper[id];// ???????
    this.setData({      
      newsData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})