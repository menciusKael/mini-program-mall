/**
*   请求
*/
const ajax = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://mps.essocial.com.cn/api/' + url,
      data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
}
/**
 *  异步设置 localStorage
 */
export const setStorage = (key, value) => wx.setStorage({
  key,
  data: value
})

/**
 *  同步读取 localStorage
 */
export const getStorageSync = key => wx.getStorageSync(key)

/**
 *  弹窗
 */
// export const showModal = ()

/**
 *  首页轮播、首页导航
 */
export const getLayoutList = page_id => ajax('layout/getLayoutList', { page_id })

/**
 *  首页推荐文章
 */
export const getRecommendedArticleList = program_id => ajax('article/getRecommendedArticleList', { program_id })

/**
 *  首页热销商品
 */
export const getRecommendedProductList = program_id => ajax('product/getRecommendedProductList', {
  program_id
})


/**
 *  分类
 */
export const getMultiProductGroupList = program_id => ajax('product_group/getMultiProductGroupList', {
  program_id
})

/**
 *  个人中心 获取用户详情
 */
export const getCustomerDetail = customer_id => ajax('customer/getCustomerDetail', {
  customer_id
})
/**
 *  个人中心 编辑用户信息
 */
export const editCustomer = (c_id, name, avatar, gender) => ajax('customer/editCustomer', {
  customer_id: c_id,
  name,
  avatar,
  gender
})

/**
 *  新闻详情
 */
export const getArticleDetail = id => ajax('article/getArticleDetail', { article_id: id })



/**
 *  
 */

/**
 *  
 */