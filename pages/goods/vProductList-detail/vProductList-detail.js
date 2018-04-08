Page({
  data: {
    currentSelectd: 1,
    buyNum: 1,
    imgUrls: [
      "http://mz.djmall.xmisp.cn/files/product/20161201/148057921620_middle.jpg",
      "http://mz.djmall.xmisp.cn/files/product/20161201/148057922659_middle.jpg",
      "http://mz.djmall.xmisp.cn/files/product/20161201/148057923813_middle.jpg",
      "http://mz.djmall.xmisp.cn/files/product/20161201/148057924965_middle.jpg",
      "http://mz.djmall.xmisp.cn/files/product/20161201/148057925958_middle.jpg"
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //滑动动画时长1s
    circular: true, //衔接动画
    collected: false,//是否收藏
    price: 99, //商品单价   
    propPopupShow: true, // 规格选择 窗口显示    
    buyNumber: 0,// 购买数量    
    buyNumMin: 1,// 最少购买    
    buyNumMax: 0,// 最多购买
  },

  onLoad: function (options) {
    var that = this;
    let id = options.id;
    // console.log(id)
    // console.log(options)
    wx.request({
      url: 'http://mps.essocial.com.cn/api/product/getProductDetail',
      method: 'POST',
      data: {
        product_id: '1'
      },
      dataType: 'json',
      success: function (res) {
        var a = res.data.data.option.all 
        console.log(Object.keys(a))
        console.log(Object.values(a))
        var aaa = Object.keys(a);
        var bbb = Object.values(a);
        // var propsDetail = [...res.data.data.option.all];
        // console.log(propsDetail)
        that.setData({
          aaa,
          bbb,
          goodsDetail : res.data.data,
          // 库存决定能否购买 及 最多购买个数
          buyNumMax: res.data.data.stock,
          buyNumber: (res.data.data.stock > 0 ? 1 : 0)
        })
      },
    })
  },
  // 商品轮播图放大查看
  previewImage(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imgUrls
    })
  },

  // 规格弹窗 显示
  chooseSize() {
    this.setData({
      propPopupShow: true
    })
  },
  // 规格弹窗 关闭
  closepropPopup() {
    this.setData({
      propPopupShow: false
    })
  },
  // 规格弹窗 购买数量加
  numAddTap() {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var tempNum = this.data.buyNumber;
      tempNum++;
      this.setData({
        buyNumber: tempNum
      })
    }
  },
  // 规格弹窗 购买数量减
  numCutTap() {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var tempNum = this.data.buyNumber;
      tempNum--;
      this.setData({
        buyNumber: tempNum
      })
    }
    if (this.data.buyNumber == 1) {
      wx.showToast({
        title: '不能再少的啦',
        icon: 'none'
      })
    }
  },
  // 本地存储，实现商品收藏/取消收藏
  onCollectTap(event) {
    if (!this.data.collected) {
      this.setData({
        collected: true
      })
      wx.showToast({
        title: '收藏成功',
        success: function () {
          wx.setStorageSync("collected", "yes")
        }
      })
    } else {
      this.setData({
        collected: false
      })
      wx.showToast({
        title: '取消收藏成功',
        success: function () {
          wx.removeStorageSync("collected");
        }
      })
    }

  },
  // 商品详情与评价切换
  onchangeItem(event) {
    let id = event.currentTarget.dataset.id
    this.setData({
      currentSelectd: id
    })
  }
})