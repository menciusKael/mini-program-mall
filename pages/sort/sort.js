// var app = getApp()

// import {
//   getMultiProductGroupList
// } from '../../utils/util';

// Page({
//   data: {
//     currentTab: 0 // 当前选中分类tab
//   },
//   onShow: function() {
//     var that = this;         
//     // 获取多级分类商品列表
//     getMultiProductGroupList(app.globalData.program_id).then(res => {
//       let resData = res.data.data; // 商品列表数据
//       let first = resData[0].product_group_id; // 直接切换tab,默认显示多级分类的第一个tab
//       var tab = wx.getStorageSync('selectTab'); // 如果从首页导航跳转过来，则显示对应tab
//       that.setData({
//         currentTab: tab ? tab : first,
//         sortData: resData
//       })
//     })
//   },
//   // tab选择
//   choose(e) {
//     let tab = e.currentTarget.dataset.index
//     this.setData({
//       currentTab: tab
//     })
//     wx.setStorageSync('selectTab', tab)
//   },
//   // 去商品中心
//   toProductGroupDetail(e) {
//     let id = e.currentTarget.dataset.id;
//     wx.navigateTo({
//       url: '/pages/goods/goods?id=' + id,
//     })
//   }
// })

// 上面部分为原分销多级分类

var app = getApp()
import {
  getMultiProductGroupList
} from '../../utils/util';
Page({
  data: {
    sortItemList: [], // 所有一级分类项
    productInfo: [], // 商品
    currentTab: 0, // 当前选中的一级分类 tab
    subTabHidden: false // 二级子 tab 默认隐藏 
  },
  onShow: function(options) {
    var that = this;
    // 获取多级分类 所有商品 列表
    getMultiProductGroupList(app.globalData.program_id).then(res => {
      let resData = res.data.data; // 所有一二级列表数据
      console.log('所有一二级列表数据')
      console.log(resData)

      // 一级分类Item数组，单独出来，不要设置太多数据,影响性能
      // let sortOneItemList = []
      // resData.forEach(item => {
      //   sortOneItemList.push(item.name) // 这样会产生问题 : data-xxx无效
      // })

      // 1. 直接切换tab,默认显示 第一个一级tab 下所有 二级tab 数据
      var tab = wx.getStorageSync('selectTab');
      if (!tab) {
        var currentTab = resData[0].product_group_id; // 当前选中第一个
        let first = resData[0].children; // 第一个一级下，所有二级tab
        first.map(item => {
          return new Promise((resolve, reject) => {
            var id = item.product_group_id;
            that.getProductListByGroup(id)
          })
        })
      } else {
        // 此处拿到 首页快读导航传过来的参数
        // 1. 如果是跳转过来到某个一级tab，则显示对应此一级tab所有子二级tab的下的数据
        // 2. 或者跳转二级tab， 则遍历循环找到对应id，再请求数据，此处会影响性能！   

        // 请求id
        let id = 0;
        console.log(tab)
        resData.forEach(item => {

          if (item.product_group_id == tab) {

            // id = item.product_group_id
            let subTab = item.children; // 二级tab
            subTab.forEach(item => {
              return new Promise((resolve, reject) => {
                id = item.product_group_id;
                that.getProductListByGroup(id)
              })
            })
          }else{
            let subItem = item.children;
            subItem.forEach(item => {
              if(item.product_group_id == tab){
                id = tab;
                that.getProductListByGroup(id)
              }
            })
          }

        })

      }

      that.setData({
        currentTab: tab ? tab : currentTab, // 一级tab当前选中
        sortItemList: resData // 一级tab数据
      })

    })
  },
  // 小三角显示隐藏二级分类栏
  showChoose() {
    this.setData({
      subTabHidden: !this.data.subTabHidden
    })
  },
  // 一级分类选择
  choose(e) {
    var tab = e.currentTarget.dataset.tab;
    console.log(tab)
    this.setData({
      currentTab: tab,
      subTabHidden: true // 点击一级分类tab，其对应的二级分类tab显示
    })
  },
  // 二级分类选择 
  getProductGroupDetail(e) {
    var that = this;
    let id = e.currentTarget.dataset.id; // 获取到二级分类组id 
    id += 'l2'
    that.setData({
      subTabHidden: false // 点击二级tab分类后，又隐藏起来，然后请求对应的数据       
    })

    //二级分类选择，请求对应类下面的数据
    that.getProductListByGroup(id)
  },
  // 请求二级分类下 商品列表数据
  getProductListByGroup(id) {
    var that = this;
    if (id.includes('l2')) {
      let end = id.length - 2;
      id = id.substring(0, end);
      wx.request({
        url: app.globalData.api + 'product/getProductListByGroup',
        method: 'POST',
        data: {
          product_group_id: id
        },
        success: function(res) {
          let productInfo = res.data.data;
          that.setData({
            productInfo
          })
        }
      })
    } else {
      wx.request({
        url: app.globalData.api + 'product/getProductListByGroup',
        method: 'POST',
        data: {
          product_group_id: id
        },
        success: function(res) {
          let productInfo = that.data.productInfo;
          let resData = res.data.data;
          productInfo = [...productInfo, ...resData]

          that.setData({
            productInfo
          })
        }
      })
    }

  }

})
