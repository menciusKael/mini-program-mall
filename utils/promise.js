module.exports = {

  promisify: api => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        const extras = {
          success: resolve,
          fail: reject
        }
        api({ ...options, ...extras }, ...params)
      })
    }
  }

}  