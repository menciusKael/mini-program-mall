var app = getApp()
Page({
  data: {
    reasonChooseShow: false,
    returnReason: '', // 退款原因选择
    order_code: '',
    id: '',
    textAreaShow: true,
    phoneType: 'android' // 默认机型为安卓
  },
  onLoad: function(options) {
    let phone = wx.getSystemInfoSync(); 
    let phoneType = phone.platform; // 调用方法获取机型  

    let returnProInfo = JSON.parse(options.returnProInfo)
    this.setData({
      returnProInfo,
      order_code: returnProInfo.code,
      id: returnProInfo.id,
      phoneType: phoneType == 'android' ? 'android' : 'ios' // 设置机型
    })
  },
  // 退款原因选择弹出
  onChooseReason() {
    this.setData({
      reasonChooseShow: true,
      textAreaShow: false
    })
  },
  // 退款原因选择隐藏
  onBindReasonConfirm() {
    this.setData({
      reasonChooseShow: false,
      textAreaShow: true
    })
  },
  // 原因选择change
  radioChange(e) {
    let returnReason = e.detail.value
    console.log(returnReason)
    this.setData({
      returnReason
    })
  },
  // 提交
  onBindReturnSubmit(e) {
    let that = this;
    let c_id = wx.getStorageSync('c_id');
    let id = that.data.id;
    let order_code = that.data.order_code;
    let returnExplain = e.detail.value.txtar1 // 退款说明
    let returnInfo = e.detail.value.txtar2 // 退款信息
    let returnReason = this.data.returnReason
    if (!returnReason) {
      wx.showModal({
        title: '提示',
        content: '请选择退款原因',
        showCancel: false
      })
      return
    }
    if (!returnInfo) {
      wx.showModal({
        title: '提示',
        content: '请填写退货物流信息',
        showCancel: false
      })
      return
    }

    wx.request({
      url: app.globalData.api + 'returns/addReturn',
      data: {
        program_id: app.globalData.program_id,
        customer_id: c_id,
        order_product_id: id,
        order_code,
        express_info: returnInfo,
        reason: returnReason,
        remark: returnExplain
      },
      method: 'POST',
      success(res) {
        if (res.data.status) {
          wx.showToast({
            title: '申请退款成功！',
            icon: 'cuccess',
            duration: 2000,
            success: function() {
              setTimeout(() => wx.navigateBack(), 2000)
            }
          })
        }
      }
    })

  }


})
