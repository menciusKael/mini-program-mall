var app = getApp()
Page({
  data: {
    totalPrice: 0, // 总价
    allSelect: true, // 全选
    list: [] // 商品数据
  },
  onLoad: function () {
    this.onShow();
  },
  onShow: function () {
    var list = []
    var shopCarInfo = wx.getStorageSync('shopCarInfo');
    if (shopCarInfo.shopList) {
      list = shopCarInfo.shopList
    }
    this.setShopCarData(this.totalPrice(), this.allSelect(), list)
  },
  // 设置数据
  setShopCarData: function (totalPrice, allSelect, list) {
    this.setData({
      totalPrice,
      allSelect,
      list
    });
    var tempNum = 0;
    for (var i = 0; i < list.length; i++) {
      tempNum += list[i].buyNum
    }
    var shopCarInfo = {}
    shopCarInfo.shopNum = tempNum;
    shopCarInfo.shopList = list;
    wx.setStorageSync('shopCarInfo', shopCarInfo)
  },
  // 总价
  totalPrice() {
    let list = this.data.list;
    let tempTotalPrice = 0;
    for (let i = 0; i < list.length; i++) {
      let curItem = list[i]
      if (curItem.checked) {
        tempTotalPrice += parseFloat(curItem.price) * curItem.buyNum
      }
    }
    tempTotalPrice = parseFloat(tempTotalPrice.toFixed(2))
    return tempTotalPrice
  },
  // 是否全选
  allSelect() {
    let list = this.data.list;
    var tempAllSelect = true;
    for (let i = 0; i < list.length; i++) {
      let curItem = list[i];
      if (curItem.checked) {
        tempAllSelect = true
      } else {
        tempAllSelect = false
        break;
      }
    }
    return tempAllSelect
  },
  // 单选事件
  onSelectTap(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    let checked = list[index].checked;
    list[index].checked = !checked;
    this.setShopCarData(this.totalPrice(), this.allSelect(), list);
  },
  // 全选/反选
  bindAllSelect() {
    let curAllSelect = this.data.allSelect;
    curAllSelect = !curAllSelect
    let list = this.data.list;
    if (curAllSelect) {
      for (let i = 0; i < list.length; i++) {
        let curItem = list[i];
        curItem.checked = true
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let curItem = list[i]
        curItem.checked = ''
      }
    }
    this.setShopCarData(this.totalPrice(), curAllSelect, list);
  },
  // 删除
  delItem(e) {
    var idx = e.currentTarget.dataset.index;
    var list = this.data.list;
    list.splice(idx, 1)
    this.setShopCarData(this.totalPrice(), this.allSelect(), list)
  },
  // 数量加
  buyNumAdd(e) {
    var idx = e.currentTarget.dataset.index;
    var list = this.data.list;

    list[idx].buyNum++

    this.setShopCarData(this.totalPrice(), this.allSelect(), list)
  },
  // 数量减
  buyNumCut(e) {
    var idx = e.currentTarget.dataset.index;
    var list = this.data.list;
    if (list[idx].buyNum == 1) {
      wx.showToast({
        title: '最少购买一件',
        icon: 'none'
      })
    } else {
      list[idx].buyNum--
      this.setShopCarData(this.totalPrice(), this.allSelect(), list)
    }
  },
  // 购物车为空去首页
  toIndexPage() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})
