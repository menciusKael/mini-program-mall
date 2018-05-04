var app = getApp();

Page({
  data: {
    region: ['请选择', '请选择', '请选择'],
    pickerSelected: false,// 改变选中样式
    addOrEdit: 0,// 编辑还是添加，默认0添加， 1编辑        
    needEditInfo: {} // 编辑数据
  },
  onLoad: function (e) {
    var that = this;
    // 判断是否为编辑
    if (e.editAddInfo) {
      let needEditInfo = JSON.parse(e.editAddInfo);
      console.log(needEditInfo)
      needEditInfo.location = JSON.parse(needEditInfo.location)
      that.setData({
        addOrEdit: 1,
        needEditInfo,
        region: needEditInfo.location
      })
    }

  },
  // 地区选择
  bindRegionChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value,
      pickerSelected: true
    })
  },
  // 新增/编辑地址
  onbindSave: function (e) {

    let name = e.detail.value.name;
    let tel = e.detail.value.tel;
    let location = e.detail.value.location;
    let address = e.detail.value.address;
    let postcode = e.detail.value.postcode;

    console.log()

    if (!name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!tel) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.region[0] == '请选择') {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!address) {
      wx.showToast({
        title: '请填写地址',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!postcode) {
      wx.showToast({
        title: '请填写邮编',
        icon: 'none',
        duration: 1000
      })
      return
    }

    // 如果有地址id，则为编辑地址
    if (e.target.dataset.id) {
      let customer_address_id = e.target.dataset.id;
      let checked = e.target.dataset.checked;

      wx.request({
        url: 'http://mps.essocial.com.cn/api/customer_address/editCustomerAddress',
        method: 'POST',
        data: {
          customer_address_id,
          name,
          tel,
          postcode,
          address,
          location,
          checked
        },
        success: function (res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '成功编辑地址',
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/adress/adress',
                  })
                }, 2000)
              }
            })

          } else {
            wx.showModal({
              title: 'sorry,服务器迷路了',
              showCancel: false
            })
          }
        },
        fail: function () {
          wx.showModal({
            title: 'sorry,服务器迷路了',
            showCancel: false
          })
        }
      })
    } else {
      var c_id = wx.getStorageSync('c_id');
      // 否则为 添加地址
      wx.request({
        url: 'http://mps.essocial.com.cn/api/customer_address/addCustomerAddress',
        method: 'POST',
        data: {
          checked: 0,
          name,
          tel,
          location,
          address,
          postcode,
          program_id: 1,
          customer_id: c_id
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.status == 1) {
            wx.showToast({
              title: '地址添加成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/adress/adress',
                  })
                }, 2000)
              }
            })
          }
        }
      })
    }
  },

  // 取消
  onBindCancel() {
    wx.redirectTo({
      url: '/pages/adress/adress',
    })
  }
})
