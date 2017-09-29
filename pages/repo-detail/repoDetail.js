const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js')
const appInstance = getApp()
var detailCtx = null
Page({
  data: {
    repoUrl: null,
    authoToken: null,
    starUrl: null,
    watchUrl: null,
    repoFullName: null,
    readMeContentUrl: null,
    repoReadmeContent: null,
    repoInfo: null,
    stargazersCount: 0,
    watchCount: 0,
    ownerName: "",
    ownerPic: null,
    starStatus: 0,
    starDisable: false,
    starLoading: false,
    watchStatus: 0,
    watchDisable: false,
    watchLoading: false,
    headerHeight: "120px"
  },
  onPageScroll: function (e) {
    if (e.scrollTop < 130) {
      wx.setNavigationBarTitle({
        title: '',
      })
    } else {
      wx.setNavigationBarTitle({
        title: this.data.repoFullName,
      })
    }
  },
  checkIsWatchRepo: function () {
    const baseUrl = appInstance.globalData.gitHubApiBaseUrl

    const checkWatch = this.data.watchUrl
    if (this.data.authoToken) {
      wx.request({
        url: checkWatch,
        header: {
          "Authorization": this.data.authoToken
        },
        complete: function (res) {
          if (res.statusCode == 204) {
            console.log("已经watch")
            //已经watch
            detailCtx.setData({
              watchStatus: 1
            })
          } else if (res.statusCode == 404) {
            console.log("未watch")
            //未watch
            detailCtx.setData({
              watchStatus: 0
            })
          } else if (res.statusCode == 401) {
            console.log("未授权")
          }
        }
      })
    }
  },
  performClickWatch: function (e) {
    const dataSet = e.currentTarget.dataset
    const authoToken = this.data.authoToken
    if (!authoToken) {
      wx.switchTab({
        url: '../index/index',
      })
    } else {
      if (dataSet.status == 0) {
        this.wathcRepository();
      } else {
        this.unWatchRepository();
      }
    }
  },
  wathcRepository: function () {
    const watchU = this.data.watchUrl
    const authoToken = this.data.authoToken
    if (!authoToken) {
      wx.navigateTo({
        url: '../index/index',
      })
      return
    } else {
      detailCtx.setData({
        watchLoading: true,
        watchDisable: true
      })
      wx.request({
        url: watchU,
        method: "PUT",
        header: {
          "Authorization": authoToken
        },
        success: function (res) {
          detailCtx.setData({
            watchLoading: false,
            watchDisable: false
          })
          if (res.statusCode == 204) {
            detailCtx.setData({
              watchStatus: 1,
              watchCount: detailCtx.data.watchCount + 1

            })
            detailCtx.reloadDetail()
          } else if (res.statusCode == 401) {
            wx.showModal({
              title: '提示',
              content: 'github token已失效',
            })
          }
        }
      })
    }
  },
  unWatchRepository: function () {
    const watchU = this.data.watchUrl
    const authoToken = this.data.authoToken
    if (!authoToken) {
      wx.navigateTo({
        url: '../index/index',
      })
      return
    } else {
      detailCtx.setData({
        watchLoading: true,
        watchDisable: true
      })
      wx.request({
        url: watchU,
        method: "DELETE",
        header: {
          "Authorization": authoToken
        },
        success: function (res) {
          detailCtx.setData({
            watchLoading: false,
            watchDisable: false
          })
          if (res.statusCode == 204) {
            detailCtx.setData({
              watchStatus: 0,
              watchCount: detailCtx.data.watchCount - 1

            })
            detailCtx.reloadDetail()
          } else if (res.statusCode == 401) {
            wx.showModal({
              title: '提示',
              content: 'github token已失效',
            })
          }

        }
      })
    }
  },
  checkIsStarRepo: function () {
    const baseUrl = appInstance.globalData.gitHubApiBaseUrl
    const checkUrl = this.data.starUrl
    if (this.data.authoToken) {
      wx.request({
        url: checkUrl,
        header: {
          "Authorization": this.data.authoToken
        },
        complete: function (e) {
          if (e.statusCode == 204) {
            console.log("已经star")
            //已经star
            detailCtx.setData({
              starStatus: 1
            })
          } else if (e.statusCode == 404) {
            console.log("未star")
            //没有star
            detailCtx.setData({
              starStatus: 0
            })
          } else if (e.statusCode == 401) {
            console.log("未授权")
          }
        }
      })
    }

  },
  performClickStar: function (e) {
    const dataSet = e.currentTarget.dataset
    const authoToken = this.data.authoToken
    if (!authoToken) {
      // wx.showModal({
      //   title: '提示',
      //   content: '请使用github账号登录',
      // })
      //没有github登录信息，跳转到登录页面
      wx.switchTab({
        url: '../index/index',
      })
    } else {
      if (dataSet.status == 0) {
        this.starRepository();
      } else {
        this.unStarRepository();
      }
    }

  },
  starRepository: function () {
    const starU = this.data.starUrl
    const authoToken = this.data.authoToken
    if (!authoToken) {
      wx.navigateTo({
        url: '../index/index',
      })
    } else {
      detailCtx.setData({
        starLoading: true,
        starDisable: true
      })
      wx.request({
        url: starU,
        method: "PUT",
        header: {
          "Authorization": authoToken
        },
        success: function (res) {
          detailCtx.setData({
            starLoading: false,
            starDisable: false
          })
          if (res.statusCode == 204) {
            //操作成功
            detailCtx.setData({
              starStatus: 1,
              stargazersCount: detailCtx.data.stargazersCount + 1
            })
            detailCtx.reloadDetail()
          } else if (res.statusCode == 401) {
            wx.showModal({
              title: '提示',
              content: 'github token已失效',
            })
          }

        }
      })
    }

  },
  unStarRepository: function () {
    const starU = this.data.starUrl
    const authoToken = this.data.authoToken
    if (!authoToken) {
      wx.navigateTo({
        url: '../index/index',
      })
      return
    } else {
      detailCtx.setData({
        starLoading: true,
        starDisable: true
      })
      wx.request({
        url: starU,
        method: "DELETE",
        header: {
          "Authorization": authoToken
        },
        success: function (res) {
          detailCtx.setData({
            starLoading: false,
            starDisable: false
          })
          if (res.statusCode == 204) {
            detailCtx.setData({
              starStatus: 0,
              stargazersCount: detailCtx.data.stargazersCount - 1

            })
            detailCtx.reloadDetail()
          } else if (res.statusCode == 401) {
            wx.showModal({
              title: '提示',
              content: 'github token已失效',
            })
          }

        }
      })
    }

  },
  reloadDetail: function () {
    //获取仓库详情信息
    const oauthTokenValue = detailCtx.data.authoToken
    const detailUrl = detailCtx.data.repoUrl
    if (oauthTokenValue) {
      //检查是否star当前项目
      detailCtx.checkIsStarRepo()
      detailCtx.checkIsWatchRepo()
      wx.request({
        url: detailUrl,
        header: {
          "Authorization": authoToken
        },
        success: function (res) {
          console.log("========");
          console.dir(res);
          wx.hideLoading()
          const ownerInfo = res.data.owner
          const repoBean = res.data
          detailCtx.setData({
            ownerName: ownerInfo.login,
            ownerPic: ownerInfo.avatar_url,
            repoInfo: repoBean,
            stargazersCount: repoBean.stargazers_count,
            watchCount: repoBean.subscribers_count
          })
        }
      })
    } else {
      wx.request({
        url: detailUrl,
        success: function (res) {
          wx.hideLoading()
          const ownerInfo = res.data.owner
          const repoBean = res.data
          detailCtx.setData({
            ownerName: ownerInfo.login,
            ownerPic: ownerInfo.avatar_url,
            repoInfo: repoBean,
            stargazersCount: repoBean.stargazers_count,
            watchCount: repoBean.subscribers_count
          })
        }
      })
    }

  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '',
    })
    wx.showLoading({
      title: '加载中',
    })
    detailCtx = this
    const baseUrl = appInstance.globalData.gitHubApiBaseUrl
    const detailUrl = appInstance.globalData.repoDetailUrl
    const oauthTokenValue = wx.getStorageSync('AuthToken') || null
    const fullName = appInstance.globalData.clickRepoFullName;
    //star/unstar 路径
    const starRepoUrl = baseUrl + "/user/starred/" + fullName
    //watch／unwatch路径
    const watchRepoUrl = baseUrl + "/user/subscriptions/" + fullName
    const readMeUrl = "https://raw.githubusercontent.com/" + fullName + "/master/README.md"
    detailCtx.setData({
      repoUrl: detailUrl,
      authoToken: oauthTokenValue,
      repoFullName: fullName,
      starUrl: starRepoUrl,
      watchUrl: watchRepoUrl,
      readMeContentUrl: readMeUrl
    })
    //检查是否star当前项目
    detailCtx.checkIsStarRepo()
    detailCtx.checkIsWatchRepo()

    //获取仓库详情信息
    wx.request({
      url: detailUrl,
      success: function (res) {
        console.log("========");
        console.dir(res);
        wx.hideLoading()
        const ownerInfo = res.data.owner
        const repoBean = res.data
        detailCtx.setData({
          ownerName: ownerInfo.login,
          ownerPic: ownerInfo.avatar_url,
          repoInfo: repoBean,
          stargazersCount: repoBean.stargazers_count,
          watchCount: repoBean.subscribers_count
        })
      }
    })

    /**
* WxParse.wxParse(bindName , type, data, target,imagePadding)
* 1.bindName绑定的数据名(必填)
* 2.type可以为html或者md(必填)
* 3.data为传入的具体数据(必填)
* 4.target为Page对象,一般为this(必填)
* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
*/
    //获取仓库readme信息
    wx.request({
      url: readMeUrl,
      success: function (res) {
        console.dir(res);
        if (res.statusCode == 200) {
          if (res.data) {
            WxParse.wxParse('readme', 'md', res.data, detailCtx, 5);
          }
        }
      }
    })

  }
})