
// 商品列表数据
// let mock1 = require('../../utils/mock1.js');
// 图文数据
let mock3 = require('../../utils/mock3.js');
 
Page({
  data: {
    goodsPageShow: true,
    searchResult: false,
    noResult: false,
    // 搜索框初始内容
    searchValue: "",
    imageSrc : [
      {
        src : '/images/product/a.png'
      },
      {
        src: '/images/product/b.png'
      },
      {
        src: '/images/product/c.png'
      },
      {
        src: '/images/product/d.png'
      },
    ]
     
  },
  onLoad: function (options) {
    var that = this;
    // let productInfo = mock1.productInfo;
    // console.log(productInfo)
    let imgText = mock3.imgText
     
    this.setData({
      // productInfo,
      imgText 
    })
    // 请求商品列表数据
    wx.request({
      url: 'http://mps.essocial.com.cn/api/product/getProductList',
      method: "POST",
      data: {
        program_id: 1,
        product_group_id: 0
      },
      success: function (res) {
        var productInfo = res.data.data;
        // console.log(productInfo)
        that.setData({
          productInfo
        });
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  // 实时检索
  onbindinput(e) {
    let val = e.detail.value;// 获取到输入框的值
  },
  onbindfocus(event) {
    // 输入框聚焦 
    this.setData({
      goodsPageShow: false,
      searchResult: true,
      // noResult : false
    })
  },
  onbindblur() {
    // 输入框失去焦点
    this.setData({
      goodsPageShow: true,
      searchResult: false
    })
  },
  onbindconfirm() {
    // 点击完成按钮
    this.setData({
      noResult: true
    })

  },
  toProductDetail(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'vProductList-detail/vProductList-detail?id=' + id,
    })
  } 
  
})