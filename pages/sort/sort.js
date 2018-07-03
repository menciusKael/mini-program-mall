var app = getApp()
import { getMultiProductGroupList } from '../../utils/util'
Page({
  data: {
    currentTab: 0
  },
  onShow: function (options) {
    var that = this;
    getMultiProductGroupList(app.globalData.program_id).then(res => {
      console.log(res)
      let resData = res.data.data;
      let first = resData[0].product_group_id
      var tab = wx.getStorageSync('selectTab');console.log(tab)
      that.setData({
        currentTab: tab ? tab : first,
        sortData: resData
      })
    })
  },
  choose(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index
    })
  },
  toProductDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + id,
    })
  }
})
