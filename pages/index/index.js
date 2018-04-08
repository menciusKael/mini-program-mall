//获取全局应用实例
const app = getApp()

var util = require('../../utils/util.js');
// var mock = require('../../utils/mock.js');

let mock2 = require('../../utils/mock2.js');

// 富文本渲染
// var WxParse = require('../../wxParse/wxParse.js');


Page({

  data: {
    list: [],
    // 轮播播放间隔
    interval: 3000,
    // 轮播本地数据
    vSliderData: [
      {
        imgSrc: "/images/vSlider1.jpg",
        imgId: 0
      },
      {
        imgSrc: "/images/vSlider2.jpg",
        imgId: 1
      },
      {
        imgSrc: "/images/vSlider3.jpg",
        imgId: 2
      }
    ]

  },
  onLoad(options) {
    var that = this;
    this.setData({
      newsList: mock2.newsList
    });

    //调登陆接口
    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       //存储 code
    //       var codeinfo = {
    //         code: res.code,
    //       };
    //       wx.setStorageSync('codeinfo', codeinfo)
    //     }
    //   },
    //   fail: function () {
    //     console.log("授权失败");
    //   },
    //   complete: function () {

    //   }
    // })
    wx.request({
      url: 'http://mps.essocial.com.cn/api/article/getArticleList',
      method: "POST",
      data: {
        program_id: 1,
        article_group_id: 0
      },
      success: function (res) {
        var articleListData = res.data.data;
        // console.log(articleListData)
        that.setData({
          articleListData
        });
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },
  // 轮播图点击跳转
  onSwiperTap(event) {
    let id = event.target.dataset.id;
    wx.navigateTo({
      url: 'vSlider-detail/vSlider-detail?id=' + id
    })
  },
  // 文章点击跳转
  toArticleDetail(event) {
    let id = event.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: 'vNewsList-detail/vNewsList-detail?id=' + id,
    })
  }
})


