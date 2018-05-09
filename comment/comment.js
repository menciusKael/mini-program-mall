Page({
  data: {
    stars: [1, 2, 3, 4, 5],
    goodDescribe: 1,
    serverAttitude: 1,
    logisService: 1,
    addImgSrc: []
  },
  onLoad: function () {

  },
  // 星级选中
  onCommentStar(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if (id == 'gd') {
      this.setData({
        goodDescribe: index
      })
    } else if (id == 'sa') {
      this.setData({
        serverAttitude: index
      })
    } else {
      this.setData({
        logisService: index
      })
    }
  },
  // 添加图片
  addPic() {
    var that = this;
    wx.chooseImage({
      count: 5,
      success: function (res) {
        that.setData({
          addImgSrc: res.tempFilePaths
        })
      }
    })
  }
})