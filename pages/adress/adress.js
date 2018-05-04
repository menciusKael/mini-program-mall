Page({
  data: {
    allAdressData: []
  },
  onLoad: function () {
    var that = this;
    // 本地读取用户id
    var c_id = wx.getStorageSync('c_id');
    // 获取当前用户所有地址信息
    wx.request({
      url: 'http://mps.essocial.com.cn/api/customer_address/getCustomerAddressList',
      data: {
        customer_id: c_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data)
        var allAdressData = res.data.data;
        that.setData({
          allAdressData
        })
      }
    })
  },
  onShow: function () {

  },
  onReady: function () {

  },

  // 编辑地址
  editAddress(e) {

    let id = e.currentTarget.dataset.id;
    let address = e.currentTarget.dataset.address;
    let name = e.currentTarget.dataset.name;
    let tel = e.currentTarget.dataset.tel;
    let postcode = e.currentTarget.dataset.postcode;
    let checked = e.currentTarget.dataset.checked;
    let location = e.currentTarget.dataset.location;

    let editAddInfo = {
      id,
      address,
      name,
      tel,
      postcode,
      checked,
      location
    }
    editAddInfo = JSON.stringify(editAddInfo)
    wx.navigateTo({
      url: '/pages/add-adress/add-address?editAddInfo=' + editAddInfo
    })
  },

  // 删除地址
  deleteAddress(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index
    if (id) {
      wx.showModal({
        title: '提示',
        content: '确认删除此地址？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'http://mps.essocial.com.cn/api/customer_address/deleteCustomerAddress',
              data: {
                customer_address_id: id
              },
              method: 'POST',
              success: function (res) {
                if (res.data.status == 1) {
                  let allAdAata = that.data.allAdressData
                  allAdAata.splice(index, 1);
                  that.setData({
                    allAdressData: allAdAata
                  })
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  addOrEditAddress(){
    wx.redirectTo({
      url: '/pages/add-adress/add-address',
    })
  },
  // 选择默认
  chooseDefault(e){
    var that = this;
    let c_id = wx.getStorageSync('c_id');
    let id = e.currentTarget.dataset.id;

    let index = e.currentTarget.dataset.index;

    console.log(id,index)

    wx.request({
      url: 'http://mps.essocial.com.cn/api/customer_address/setDefaultCustomerAddress',
      data : {
        customer_address_id : id,
        customer_id : c_id
      },
      method:'POST',
      success:function(res){
        if(res.data.status == 1){
          let allAdressData = that.data.allAdressData;
          for (let i = 0; i < allAdressData.length; i++){
            let tempItem = allAdressData[i];
            tempItem.checked = '0'
          }
          allAdressData[index].checked = 1
          that.setData({
            allAdressData            
          })
        }
      }
    })
  }
})