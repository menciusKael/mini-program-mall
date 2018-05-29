var prom = require('../../../utils/promise.js');
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    currentSelectd: 1,
    interval: 3000,
    propPopupShow: false,
    goodsDetail: {},
    price: 0,
    // toChooseOption: '',
    optionSelect: {},
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,
    shopNum: 0,
    shopCarInfo: {},
    buyNowInfo: {},
    shopType: 'addShopCar',
    onShare: false,
    allComment: true,
    collected: 0,
    goodsComment: [], // 商品评论
    // 海报
    qrCodePath: '',
    goodsPicPath: '',
    posterShow: false
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

    let id = options.id;
    var c_id = wx.getStorageSync('c_id')
    // 商品详情
    wx.request({
      url: 'http://mps.essocial.com.cn/api/product/getProductDetail',
      method: 'POST',
      data: {
        product_id: id,
        customer_id: c_id
      },
      success: function (res) {
        var goodsDetail = res.data.data;
        console.log(res);
        var description = goodsDetail.description;
        that.setData({
          goodsDetail,
          price: goodsDetail.basicInfo.price,
          buyNumMax: goodsDetail.basicInfo.stock,
          buyNumber: goodsDetail.basicInfo.stock ? 1 : 0,
          collected: goodsDetail.basicInfo.collected
        })

        WxParse.wxParse('description', 'html', description, that, 5);
        // 规格
        // if (goodsDetail.option) {
        //   var optionsTemp = '';
        //   for (var i = 0; i < goodsDetail.option.length; i++) {
        //     optionsTemp = optionsTemp + " " + goodsDetail.option[i].name
        //   }
        // }
        // that.setData({
        //   toChooseOption: optionsTemp
        // })
      },
    })

    var scene = decodeURIComponent(options.scene)
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

          if (res.data.data) {
            that.setData({
              price: res.data.data.price,
              buyNumber: res.data.data.stock ? 1 : 0,
              // buyNumMax: res.data.data.buylimit
            })
          } else {
            that.setData({
              price: 0
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
    // shopCarItem.size = this.data.optionSelect;
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
  // 组件立即购买信息
  buildBuyNowInfo() {
    var buyNowItem = {}
    buyNowItem.id = this.data.goodsDetail.basicInfo.product_id;
    buyNowItem.price = this.data.goodsDetail.basicInfo.price;
    buyNowItem.name = this.data.goodsDetail.basicInfo.name;
    buyNowItem.pic = this.data.goodsDetail.pictures[0];
    buyNowItem.buyNumber = this.data.buyNumber;
    buyNowItem.size = this.data.optionSelect;
    return buyNowItem;
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
    if (this.data.goodsDetail.option.length !== Object.keys(this.data.optionSelect).length) {
      wx.showModal({
        title: '提 示',
        content: '请选择规格！',
        showCancel: false
      })
      return;
    }

    if (!this.data.price) {
      wx.showModal({
        title: '提 示',
        content: '暂无相应规格产品',
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
      duration: 2000
    })

  },
  // 立即购买
  buyNow() {
    if (this.data.goodsDetail.option.length !== Object.keys(this.data.optionSelect).length) {
      wx.showModal({
        title: '提 示',
        content: '请选择规格！',
        showCancel: false
      })
      return;
    }

    if (!this.data.price) {
      wx.showModal({
        title: '提 示',
        content: '暂无相应规格产品',
        showCancel: false
      })
      return;
    }
    var buyNowInfo = this.buildBuyNowInfo()
    this.setData({
      buyNowInfo
    })
    wx.setStorage({
      key: 'buyNowInfo',
      data: buyNowInfo
    })
    this.closepropPopup();
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm?shopType=buyNow',
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

  // 商品详情,参数,评价
  onchangeItem(e) {
    var that = this;
    var productId = that.data.goodsDetail.basicInfo.product_id;
    let id = e.currentTarget.dataset.id
    that.setData({
      currentSelectd: id
    })
    if (id == 3) {
      wx.request({
        url: 'http://mps.essocial.com.cn/api/product/getProductCommentList',
        data: {
          product_id: productId
        },
        method: 'POST',
        success: function (res) {
          let allCommentData = res.data.data;
          console.log(allCommentData)
          that.setData({
            goodsComment: allCommentData
          })
        }
      })
    }
  },

  // 规格弹窗 购买数量加
  numAddTap() {

    if (this.data.buyNumber < this.data.buyNumMax) {
      var tempNum = this.data.buyNumber;
      tempNum++;
      this.setData({
        buyNumber: tempNum
      })
    } else {
      wx.showToast({
        title: '最多购买' + this.data.buyNumMax + '件哦',
        icon: 'none'
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

  // 去购物车页面
  toShopCarPage() {
    wx.switchTab({
      url: '../shop-car/shop-car',
    })
  },

  // 商品收藏/取消收藏
  onCollectTap(e) {
    var that = this;
    var c_id = wx.getStorageSync('c_id')
    var productId = that.data.goodsDetail.basicInfo.product_id;
    var collected = that.data.collected;
    if (!collected) {
      wx.request({
        url: 'http://mps.essocial.com.cn/api/product_collected/addProductCollected',
        data: {
          program_type: 3,
          product_id: productId,
          customer_id: c_id,
          program_id: 2
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status) {
            that.setData({
              collected: 1
            })
          }
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            mask: true
          })
        }
      })
    }
    if (collected) {
      wx.request({
        url: 'http://mps.essocial.com.cn/api/product_collected/deleteProductCollected',
        data: {
          customer_id: c_id,
          product_id: productId
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status) {
            that.setData({
              collected: 0
            })
          }
          wx.showToast({
            title: '取消收藏成功',
            icon: 'success',
            mask: true
          })
        }
      })
    }

  },
  // 分享  
  onShareGood() {
    this.setData({
      onShare: true
    })
  },
  // 取消 
  oncCncelShare() {
    this.setData({
      onShare: false
    })
  },
  // 转发
  onShareAppMessage: function (res) {
    return {
      title: '翼升小程序',
      path: '/pages/goods/vProductList-detail/vProductList-detail',
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '转发成功',
          showCancel: false
        })
      }
    }
  },
  changeComType() {
    this.setData({
      allComment: !this.data.allComment
    })
  },

  sharePoster() {
    var that = this;
    var goodsDetail = that.data.goodsDetail;
    wx.getImageInfo({
      src: goodsDetail.pictures[0],//服务器返回的带参数的小程序码地址
      success: function (res) {
        //res.path是网络图片的本地地址
        that.setData({
          goodsPicPath: res.path,
          // posterShow :true
        })
      },
      fail: function (res) {
        //失败回调
      }
    });
    wx.request({
      url: 'http://mps.essocial.com.cn/api/product/getProductQrCode',
      data: {
        product_id: "1",
        page_path: "pages/decor/article/article",
        program_id: "2"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        wx.getImageInfo({
          src: res.data.data,//服务器返回的带参数的小程序码地址
          success: function (re) {
            //re.path是网络图片的本地地址
            that.drawSharePic(re.path);
          },
          fail: function (res) {
            //失败回调
          }
        });
      }
    })
  },

  /**
 * 绘制分享的图片
 */
  drawSharePic: function (qrCode) {
    var that = this;
    
    var goodsDetail = that.data.goodsDetail;

    //y方向的偏移量，因为是从上往下绘制的，所以y一直向下偏移，不断增大。
    let yOffset = 10;
    let goodsPicPath = this.data.goodsPicPath;
    let qrCodePath = qrCode;
    console.log(goodsPicPath, qrCodePath);
    // let qrCodePath = this.data.qrCodePath;
    const goodsTitle = goodsDetail.basicInfo.name;
    let goodsTitleArray = [];
    //为了防止标题过长，分割字符串,每行18个
    for (let i = 0; i < goodsTitle.length / 18; i++) {
      if (i > 2) {
        break;
      }
      goodsTitleArray.push(goodsTitle.substr(i * 18, 20));
    }
    const price = goodsDetail.basicInfo.price;
    const marketPrice = "123";
    const name = "小程序名称";
    const title1 = '您的好友邀请您一起分享精品好货';
    const title2 = '立即打开看看吧';
    const codeText = '长按识别小程序码';
    const imgWidth = 280;
    const imgHeight = 390;

    const canvasCtx = wx.createCanvasContext('shareCanvas');
    //绘制背景
    canvasCtx.setFillStyle('white');
    canvasCtx.fillRect(0, 0, imgWidth, imgHeight);
    //绘制分享的标题文字
    canvasCtx.setFontSize(14);
    canvasCtx.setFillStyle('#333333');
    canvasCtx.setTextAlign('center');
    canvasCtx.fillText(title1, 144, 16);
    //绘制分享的第二行标题文字
    canvasCtx.fillText(title2, 144, 30);
    //绘制商品图片
    canvasCtx.drawImage(goodsPicPath, 0, 38, 280, 180);
    //绘制商品标题
    yOffset = 240;
    goodsTitleArray.forEach(function (value) {
      canvasCtx.setFontSize(14);
      canvasCtx.setFillStyle('#333333');
      canvasCtx.setTextAlign('left');
      canvasCtx.fillText(value, 2, yOffset);
      yOffset += 16;
    });
    //绘制价格
    yOffset += 8;
    canvasCtx.setFontSize(14);
    canvasCtx.setFillStyle('#f9555c');
    canvasCtx.setTextAlign('left');
    canvasCtx.fillText('￥', 2, yOffset);
    canvasCtx.setFontSize(16);
    canvasCtx.setFillStyle('#f9555c');
    canvasCtx.setTextAlign('left');
    canvasCtx.fillText(price, 12, yOffset);
    //绘制原价
    const xOffset = (price.length / 2 + 1) * 18 + 18;
    canvasCtx.setFontSize(14);
    canvasCtx.setFillStyle('#999999');
    canvasCtx.setTextAlign('left');
    canvasCtx.fillText('原价:¥' + marketPrice, xOffset, yOffset);
    //绘制原价的删除线
    canvasCtx.setLineWidth(1);
    canvasCtx.moveTo(xOffset, yOffset - 6);
    canvasCtx.lineTo(xOffset + (3 + marketPrice.toString().length / 2) * 14, yOffset - 6);
    canvasCtx.setStrokeStyle('#999999');
    canvasCtx.stroke();
    //绘制分割线
    canvasCtx.setLineWidth(0.5);
    canvasCtx.moveTo(0, yOffset + 10);
    canvasCtx.lineTo(280, yOffset + 10);
    canvasCtx.setStrokeStyle('#dddddd');
    canvasCtx.stroke();
    //绘制最底部文字
    canvasCtx.setFontSize(14);
    canvasCtx.setFillStyle('#333333');
    // canvasCtx.setTextAlign('center');
    canvasCtx.fillText(name, 120, 320);

    canvasCtx.setFontSize(14);
    canvasCtx.setFillStyle('#333333');
    // canvasCtx.setTextAlign('center');
    canvasCtx.fillText(codeText, 120, 340);
    //绘制二维码
    canvasCtx.drawImage(qrCodePath, 20, 300, 80, 80);
    canvasCtx.draw();

    //绘制之后加一个延时去生成图片，如果直接生成可能没有绘制完成，导出图片会有问题。
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
        destWidth: imgWidth,
        destHeight: imgHeight,
        canvasId: 'shareCanvas',
        success: function (res) {
          that.setData({
            shareImage: res.tempFilePath,
            showSharePic: true,

          })
          wx.hideLoading();
        },
        fail: function (res) {
          console.log(res)

        }
      })
    }, 2000);
    that.setData({
      posterShow: true
    })
  },
  saveImage() {
    const wxCanvasToTempFilePath = prom.promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = prom.promisify(wx.saveImageToPhotosAlbum)

    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      wx.showToast({
        title: '已保存到相册'
      })
    })
  },

})
