Page({
  data: {
    curCouponState: 1
  },
  onSelectCouState(e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      curCouponState: idx
    })
  }
})