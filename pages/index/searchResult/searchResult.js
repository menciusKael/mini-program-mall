
Page({
  data: {
    haveSearch: false,
    haveResult: 0,
    searchHistoryData: []
  },
  onLoad() {

  },
  // 聚焦
  onbindfocus(e) {
    var searchHistoryDatas = wx.getStorageSync('ssls') || [];
    // console.log(searchHistoryDatas)
    this.setData({
      haveSearch: false,
      haveResult: 0,
      searchHistoryData: searchHistoryDatas
    })
    
  },
  // 失去焦点
  onbindblur(e) {
    var that = this;
    var inputValue = e.detail.value;// 输入值
    if (!inputValue) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
    } else {
      // 搜索历史 
                  
      var tempSearchHistory = wx.getStorageSync('ssls') || []      
      tempSearchHistory.unshift(inputValue);
      wx.setStorageSync('ssls', tempSearchHistory)

      that.setData({
        haveSearch: true,
        searchHistoryData:[]
      })
      wx.request({
        url: 'http://mps.essocial.com.cn/api/search/search ',
        method: 'POST',
        data: {
          program_id: 1,
          keyword: inputValue
        },
        success: function (res) {
          // console.log(res)

          if (res.data.status) {
            that.setData({
              haveResult: 1
            })
            if (res.data.data.products.length > 0) {
              that.setData({
                productInfo: res.data.data.products
              })
            } else {
              that.setData({
                productInfo: []
              })
            }
            if (res.data.data.articles.length > 0) {
              that.setData({
                articleListData: res.data.data.articles
              })
            } else {
              that.setData({
                articleListData: []
              })
            }
          } else {
            that.setData({
              haveResult: 0
            })
          }


        }
      })
    }

  },
  delSearchHistory(){
    wx.clearStorage()
    this.setData({
      searchHistoryData : []
    })
  },
  cancelSearch(){
    wx.navigateBack({      
    })
  }

})