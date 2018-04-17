Page({
  data: {
    currentSelectd: 1,// 详情与评论当前选择    
    interval: 3000, // 自动切换时间间隔,3s
    propPopupShow: false, // 规格选择窗口显示
    goodsDetail: {}, // 商品详情数据
    price: 0,//商品价格    
    toChooseOption: '', //选择规格
    optionSelect: {},// 选择的规格    
    buyNumber: 0,// 购买数     
    buyNumMin: 1,// 最少购买    
    buyNumMax: 0,// 最多购买
    canBuy: false, //是否已经可以购买
    shopNum: 0,  // 购买总数
    shopCarInfo: {},// 购物车信息
    shopType: 'addShopCar', // 购物方式
  },

  onLoad: function (options) {
    var that = this;

    // 获取购物车信息
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        })
      }
    })

    // let id = options.id;
    // 商品详情
    wx.request({
      url: 'http://mps.essocial.com.cn/api/product/getProductDetail',
      method: 'POST',
      data: {
        product_id: '1'
      },
      success: function (res) {
        var goodsDetail = res.data.data;
        console.log(res.data.data);
        that.setData({
          goodsDetail,
          price: goodsDetail.basicInfo.price,
          buyNumMax: goodsDetail.basicInfo.stock,
          buyNumber: goodsDetail.basicInfo.stock ? 1 : 0
        })
        // 规格
        if (goodsDetail.option) {
          var optionsTemp = '';
          for (var i = 0; i < goodsDetail.option.length; i++) {
            optionsTemp = optionsTemp + " " + goodsDetail.option[i].name
          }
        }
        that.setData({
          toChooseOption: optionsTemp
        })
      },
    })
  },

  // 规格选择
  onBindchange(event) {
    var that = this;
    var needSelectNum = that.data.goodsDetail.option.length;
    var optionName = event.currentTarget.dataset.optionname;
    var chooseValue = event.detail.value;
    that.data.optionSelect[optionName] = chooseValue;
    var curSelectNum = Object.keys(that.data.optionSelect).length;
    if (needSelectNum == curSelectNum) {
      wx.request({
        url: 'http://mps.essocial.com.cn/api/product_option/getProductOptionDetail',
        method: 'POST',
        data: {
          product_id: that.data.goodsDetail.basicInfo.product_id,
          option_value: JSON.stringify(that.data.optionSelect)
        },
        success: function (res) {
          console.log(res.data.data)
          if (res.data.data) {
            that.setData({
              price: res.data.data.price,
              buyNumber: res.data.data.stock ? 1 : 0,
              // buyNumMax: res.data.data.buylimit
              canBuy: true,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '暂无相应规格产品',
              showCancel: false
            })
          }
        }
      })
    }
  },

  // 组建购物车信息
  bulidShopCarInfo() {

    // 商品信息
    var shopCarItem = {}
    shopCarItem.id = this.data.goodsDetail.basicInfo.product_id;
    shopCarItem.price = this.data.goodsDetail.basicInfo.price;
    shopCarItem.name = this.data.goodsDetail.basicInfo.name;
    shopCarItem.pic = this.data.goodsDetail.pictures[0];
    shopCarItem.buyNum = this.data.buyNumber;// 单个商品购买数量
    shopCarItem.size = this.data.optionSelect;

    // 获取购物车信息
    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }

    var haveSomeGoodIndex = -1; // 默认没有某商品
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tempshopCarItem = shopCarInfo.shopList[i];
      var sameSize = Object.is(this.sizeKeySort(tempshopCarItem.size), this.sizeKeySort(shopCarItem.size))

      if (tempshopCarItem.id == shopCarItem.id && sameSize) {
        haveSomeGoodIndex = i;
        shopCarItem.buyNum = shopCarItem.buyNum + tempshopCarItem.buyNum;
        //?
      }
    }

    // 购物车购买总数
    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;

    if (haveSomeGoodIndex > -1) {
      shopCarInfo.shopList.splice(haveSomeGoodIndex, 1, shopCarItem)
    } else {
      shopCarInfo.shopList.push(shopCarItem)
    }

    return shopCarInfo;

  },

  // 规格选项排序
  sizeKeySort(obj) {
    var tempKey = Object.keys(obj).sort();
    var sizeSorted = {}
    for (var i = 0; i < tempKey.length; i++) {
      sizeSorted[tempKey[i]] = obj[tempKey[i]]
    }
    return JSON.stringify(sizeSorted)
  },

  // 加入购物车
  addShopCar() {
    if (!this.data.canBuy) {
      wx.showModal({
        title: '提 示',
        content: '请选择规格！',
        showCancel: false
      })
      return;
    }

    var shopCarInfo = this.bulidShopCarInfo();
    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    })

    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarInfo
    })

    this.closepropPopup();

    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 3000
    })

  },

  // 商品轮播图放大查看
  previewImage(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.goodsDetail.pictures
    })
  },

  // 去加入购物车
  toAddShopCar() {
    this.setData({
      shopType: 'addShopCar'
    })
    this.chooseSize();
  },

  // 去立即购买
  toBuyNow() {
    this.setData({
      shopType: 'buyNow'
    })
    this.chooseSize();
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

  // 商品详情与评价切换
  onchangeItem(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      currentSelectd: id
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

  // 商品收藏/取消收藏
  onCollectTap(e) {
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
  }
})
