var MD5Util = require('../../utils/MD5Encode.js');
var app = getApp()
Page({
  data: {
    haveAddress: false, // 默认没有默认地址
    defaultAddress: {}, // 地址信息    
    shopList: [], // 商品信息
    allProductNum: 0, // 总的商品数量
    total: 0, // 商品的总金额
    freight: 0, // 运费,默认0元，也就是包邮

    pointAmount: 0, // 积分抵扣金额
    selPointAmount: 0, // 当前选中积分金额

    isVip: false, // 默认不是会员
    discount: 1, //          

    haveCoupon: false, // 默认没有优惠卷
    coupons: [], // 卡卷包
    // curSelectCoupon: null, // 当前选中的卡卷
    couponAmount: 0, // 当前选中的卡卷的金额 
    couponType: 1, // 当前选中优惠卷类型，默认是 满减，包括红包， 如果是折扣卷则 为2   

    allTotalFre: 0 // 最后的总金额
  },
  onLoad: function (options) {
    // 该页面setData使用较为频繁，有可能会较慢，友好提示
    // // 、setData注意：
    // 将数据从逻辑层发送到视图层是异步 改变this.data是同步的
    // 也就是说改变值是同步的, 改变值之后渲染页面是异步的,
    //   应该是为了提高性能, 不可能改变一次数据渲染一次页面, 等所有data改变完之后一块渲染页面. 

    wx.showLoading({
      title: '加载中...',
    })
    
    // 因为右上角返回键返回了购物车，所以onLoad每次进入都会执行，不会造成不更新Bug
    // 购物类型为立即购买
    console.log('onLoad执行')
    if (options.shopType) {
      let buyNowInfo = wx.getStorageSync('buyNowInfo'); //从本地获取立即购买商品信息
      let shopList = [];
      // 对规格进行数据处理
      var size = buyNowInfo.size;
      var label = ''
      Object.keys(size).forEach(item => {
        label += `${item}:${size[item]} `
      })
      buyNowInfo.size = label;
      shopList.push(buyNowInfo)

      this.setData({
        shopList, // 商品列表
        allProductNum: buyNowInfo.buyNum, // 共 allProductNum 件商品   
        // 合计 : 所有商品的原 总 价 total，
        total: parseInt(buyNowInfo.buyNum) * parseFloat(buyNowInfo.price)
      })
    } else {
      // 购物类型为购物车
      var shopCarInfo = wx.getStorageSync('shopCarInfo'); // 本地获取购物车信息
      var shopList = [];
      var shopNum = 0;
      for (var i = 0; i < shopCarInfo.shopList.length; i++) {
        var temp = shopCarInfo.shopList[i];
        // 对规格进行处理
        var size = temp.size;
        var label = ''
        Object.keys(size).forEach(item => {
          label += `${item}:${size[item]} `
        })
        temp.size = label;
        // 在购物车有可能有商品未勾选
        if (temp.checked) {
          shopNum += temp.buyNum;
          shopList.push(temp)
        }
      }
      this.setData({
        shopList,
        allProductNum: shopNum, // 商品购买总数
        total: parseFloat(shopCarInfo.totalPrice) // 商品总价，此处直接读取，在购物车已经计算好了
      })
    }
  },
  onShow: function () {
    let that = this;
    // 获取 默认地址、运费、优惠卷（满减/折扣）、积分抵扣信息
    let c_id = wx.getStorageSync('c_id')
    let product_array = that.data.shopList;
    wx.request({
      url: 'https://mps.essocial.com.cn/api/checkout/checkout',
      method: 'POST',
      data: {
        program_id: app.globalData.program_id,
        customer_id: c_id,
        product_array // 商品数组
      },
      success: function (res) {
        console.log(res)

        // status为1表示请求成功
        if (res.data.status) {
          var res = res.data.data;

          // 默认地址处理 ,有返回{...},没有返回 null
          if (res.address) {
            var defaultAddress = res.address; // 默认地址
            // 没有地址，不能购买，运费先设置为 填写收货地址后可知
            var freight = parseFloat(res.freight)
            that.setData({
              haveAddress: true,
              defaultAddress,
              freight
            })
          }

          // 会员
          if (res.vip_discount.length) {
            // 折扣值，注意此值 可能的出现情况
            var discount = parseFloat(res.vip_discount[0].value);
            that.setData({
              isVip: true,
              discount
            })
          } else {
            that.setData({
              isVip: false
            })
          }

          // 积分
          if (res.point_discount.length) {
            let pointData = res.point_discount[0]
            that.setData({
              // 积分 抵扣的 具体金额，需要展示，选中时，需要赋值
              pointAmount: parseInt(pointData.value)
            })
          }

          // 优惠卷
          if (res.discount.length) {
            that.setData({
              coupons: res.discount, // 卡卷包设置上去
              haveCoupon: true // ，有优惠卷
            })
          }

          that.setTotalFre()

        } else {

          // staus不为1时,请求失败
          wx.showToast({
            title: '登录无效!',
            icon: 'none'
          })
        }

      }
    })

    wx.hideLoading()
  },
  // 设置最后总金额
  // total, couponAmount, couponType, discount, selPointAmount, freight
  setTotalFre() {
    // 注意数值类型
    // 计算规则 : 优惠卷满减 => *会员打折 => -积分抵扣 => +运费
    let total = this.data.total; // 商品总价
    let couponAmount = this.data.couponAmount; // 优惠卷金额
    let couponType = this.data.couponType; // 优惠卷类型

    let discount = 1;
    let isVip = this.data.isVip;
    if (isVip) {
      // 是会员的情况下需要除以10，注意 1折的情况, 非会员的情况下，默认discount为也为1
      discount = this.data.discount / 10; // 折扣 ，注意除以10
    }

    let selPointAmount = this.data.selPointAmount; // 选中的 积分抵扣金额，默认为0
    let freight = this.data.freight; // 运费

    // 先减营销工具的满减券 或者 乘营销工具折扣券 ，然后乘会员折扣
    let tcd = couponType == 1 ? (total - couponAmount) * discount : (total * couponAmount * discount);
    let allTotalFre = parseFloat(tcd - selPointAmount + freight)

    // 金额为0时不能购买，金额不能为负数
    if (allTotalFre <= 0){
      allTotalFre = 0.01
    }

    // 然后减去 积分抵扣 ，加上运费，为最后的总金额
    this.setData({
      allTotalFre
    })

  },

  // 选择积分抵扣
  onBindChangePoint(e) {
    console.log(e)
    let pointAmount = this.data.pointAmount; // 拿到onShow中请求到的 积分兑换金额
    // 积分的选择,目前只有三个选择,默认是 上下箭头 , 然后是使用和不使用积分，绑定事件，选中积分会得到对应的id，从0开始，使用积分在中间，所以选中时  id= 1
    let chooseItemId = e.detail.value[0];

    this.setData({
      selPointAmount: chooseItemId == 1 ? pointAmount : 0
    })

    this.setTotalFre() // 计算总金额
  },

  // 选择优惠卷
  onBindChangeCoupon(e) {
    // 优惠卷的选择同 积分的选择 ，目前暂未开始优惠卷
    console.log(e.detail.value[0])

    let chooseItemId = e.detail.value[0]; //选中 卡卷的第几个

    let coupons = this.data.coupons; // 所有优惠卷信息

    // 如果选中第一个，也就是默认的选中，也就是上下三角，则不做处理
    if (chooseItemId == 0) {
      this.setData({
        couponType: 1,
        couponAmount: 0
      })
      this.setTotalFre() // 设置总价
    } else {
      // 满减的情况
      if (coupons[chooseItemId - 1].type == 1) {
        this.setData({
          couponType: 1,
          couponAmount: parseFloat(coupons[chooseItemId - 1].value)
        })
      } else if (coupons[chooseItemId - 1].type == 2) {
        // 折扣卷的情况
        let tempCouponAmount = parseFloat(coupons[chooseItemId - 1].value)
        let couponAmount = tempCouponAmount.toFixed(2) / 10
        this.setData({
          couponType: 2,
          couponAmount
        })
      } else {
        // 兑换卷的情况  
        this.setData({
          couponType: 1,
          couponAmount: 0
        })
        this.setTotalFre() // 设置总价
      }

    }

    this.setTotalFre() // 设置总价
  },

  // 提交订单
  submitOrder(e) {
    let that = this;
    // 默认地址，莫有地址不能买
    let defaultAddress = that.data.defaultAddress;
    if (!Object.keys(defaultAddress).length) {
      wx.showModal({
        title: '提示',
        content: '请添加收货地址',
        showCancel: false
      })
      return
    }

    // 地址信息
    let [name, tel, address] = [defaultAddress.name, defaultAddress.tel, defaultAddress.address]

    let openId = wx.getStorageSync('open_id');
    let c_id = wx.getStorageSync('c_id')
    var [total, freight, couponAmount] = [that.data.total, that.data.freight, that.data.couponAmount]
    let product_array = that.data.shopList; // 商品数组

    // 最终价格  
    let total_fee = that.data.allTotalFre; // 最后计算出来的总价格 // 最后支付的钱

    let total_all = that.data.total + that.data.freight; // 商品总价加运费

    // 买家留言
    let remark = e.detail.value.remark;
    
    wx.request({
      url: 'https://mps.essocial.com.cn/api/checkout/prepay',
      method: 'POST',
      data: {
        openId,
        total_all, // 最后支付的钱
        total_fee, // 商品原总价+运费， 不包含会员，卡卷，积分等等
        name,
        tel,
        address,
        freight,
        program_id: app.globalData.program_id,
        customer_id: c_id,
        remark,
        product_array
      },
      success: function (res) {
        
        console.log(res)
        if (res.statusCode == 200) {
          // 时间戳 timestamp
          var date = new Date()
          var timeStamp = date.getTime().toString().substr(0, 10)
          var nonceStr = res.data.nonce_str;
          // 数据包 package
          var packageA = 'prepay_id=' + res.data.prepay_id;
          // 签名 paySign                
          var stringA = `appId=${res.data.appid}&nonceStr=${nonceStr}&package=${packageA}&signType=MD5&timeStamp=${timeStamp}`;
          var stringSignTemp = `${stringA}&key=${res.data.key}`;
          var sign = MD5Util.hexMD5(stringSignTemp).toUpperCase();
          // 发起微信支付
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': packageA,
            'signType': 'MD5',
            'paySign': sign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              })
            },
            'fail': function (res) {
              console.log(res)
            }
          })
        } else {
          wx.showToast({
            title: '服务器迷路了',
            icon: 'none'
          })
        }
      }
    })

  },

  // 新增地址
  toAddAddress() {
    wx.navigateTo({
      url: '/pages/add-adress/add-address',
    })
  },
  // 选择默认地址
  chooseDefaultAddress() {
    wx.navigateTo({
      url: '/pages/adress/adress',
    })
  }

})