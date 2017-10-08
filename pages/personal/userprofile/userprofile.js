// pages/personal/userprofile/userprofile.js
var page = 1, perpage = 16;
const githubService = require("../../../utils/githubservice.js")
const app = getApp();  //获取微信小程序实例
var pageCtx = null;
var requestList = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oauthToken: "",
    tabActive: [true, false, false, false],
    userName: "",
    userUrl: "",
    gitHubUserInfo: null,
    currentListUrl: "",
    repoHeight: "200px",
    listData: [],
    listType: 1,
    loadTabType:0,
    headerStyle: "relative"
  },
  tabClick: function (opt) {
    const length = requestList.length
    for (let j = 0; j < length; j++) {
      if (requestList[j]) {
        requestList[j].abort()
      }
    }
    const dataSet = opt.currentTarget.dataset;
    var tabActive = [false, false, false, false]
    tabActive[dataSet.tabtype] = true;
    this.setData({
      tabActive: tabActive,
      currentListUrl: dataSet.url,
      listData: [],
      listType: dataSet.datatype
    })
    page = 1;
    pageCtx.loadList();
  },
  showUserInfo: function (res) {
    wx.navigateTo({
      url: '../../personal/userprofile/userprofile?userName=' + res.currentTarget.dataset.ownername,
    })
  },
  showRepoDetail: function (e) {
    const clickData = e.currentTarget.id;
    const splitData = clickData.split(";");
    const repoUrl = splitData[0];

    app.globalData.repoDetailUrl = repoUrl
    app.globalData.clickRepoFullName = splitData[1]

    wx.navigateTo({
      url: '../../repo-detail/repoDetail',
    })
  },
  loadList: function (res) {
    const listUrl = this.data.currentListUrl
    const oauthToken = this.data.oauthToken;
    console.log(listUrl)
    if (oauthToken && listUrl) {
      requestList.push(wx.request({
        url: listUrl + "?page=" + page + "&per_page=" + perpage,
        header: {
          "Authorization": oauthToken
        },
        success: function (res) {
          if (res.statusCode == 200) {
            const list = res.data;
            if (list.length == 0) {
              if (page > 1) {
                page--;
              }
              setTimeout(function () {
                wx.hideLoading()
              }, 300)
            } else {
              wx.hideLoading()
            }
            if (page > 1) {
              pageCtx.setData({
                listData: pageCtx.data.listData.concat(list)
              })
            } else {
              pageCtx.setData({
                listData: list
              })
            }
          } else {
            if (page > 1) {
              page--;
            }
          }
        }
      }))
    } else {
      if (listUrl){
        requestList.push(wx.request({
          url: listUrl + "?page=" + page + "&per_page=" + perpage,
          success: function (res) {
            if (res.statusCode == 200) {
              const list = res.data;
              if (list.length == 0) {
                if (page > 1) {
                  page--;
                }
                setTimeout(function () {
                  wx.hideLoading()
                }, 300)
              } else {
                wx.hideLoading()
              }
              if (page > 1) {
                pageCtx.setData({
                  listData: pageCtx.data.listData.concat(list)
                })
              } else {
                pageCtx.setData({
                  listData: list
                })
              }
            } else {
              if (page > 1) {
                page--;
              }
            }
          }
        }))
      }
      
    }

  },
  onPageScroll: function (e) {
    if (e.scrollTop < 130) {
      wx.setNavigationBarTitle({
        title: '',
      })
      if (pageCtx.data.headerStyle != 'relative') {
        pageCtx.setData({
          headerStyle: "relative"
        })
      }

    } else {
      wx.setNavigationBarTitle({
        title: pageCtx.data.userName,
      })
      if (pageCtx.data.headerStyle != 'fixed') {
        pageCtx.setData({
          headerStyle: "fixed"
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("---------------------");
    console.dir(options);
    pageCtx = this;
    const userUrl = githubService.userUrl(options.userName)
    const oauthToken = wx.getStorageSync('AuthToken') || null
    this.setData({
      userName: options.userName,
      userUrl: userUrl,
      oauthToken: oauthToken
    })
    if (options.tabType) {
      this.data.loadTabType=options.tabType
      var opt = {
        currentTarget: {
          dataset: { 
            tabtype: options.tabType ,
            url: options.url,
            datatype: options.datatype
            }
        }
      };
      this.tabClick(opt);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const userUrl = this.data.userUrl;
    const oauthToken = this.data.oauthToken;
    if (oauthToken) {
      wx.request({
        url: userUrl,
        header: {
          "Authorization": oauthToken
        },
        success: function (res) {
          const uInfo = res.data;;
          uInfo.repos_url = githubService.userRepoUrl(uInfo.login);
          uInfo.starred_url = githubService.userStarUrl(uInfo.login);
          uInfo.followers_url = githubService.userFollowersUrl(uInfo.login);
          uInfo.following_url = githubService.userFollowingsUrl(uInfo.login);
          const loadUrl = [uInfo.repos_url, uInfo.starred_url, uInfo.followers_url, uInfo.following_url];
          const targeUrl = loadUrl[pageCtx.data.loadTabType]
          console.log(loadUrl)
          console.log(pageCtx.data.loadTabType)
          console.log(targeUrl)
          pageCtx.setData({
            gitHubUserInfo: uInfo,
            currentListUrl: targeUrl
          })
          pageCtx.data.currentListUrl=targeUrl
          pageCtx.loadList();
        }
      })
    } else {
      wx.request({
        url: userUrl,
        success: function (res) {
          const uInfo = res.data;;
          uInfo.repos_url = githubService.userRepoUrl(uInfo.login);
          uInfo.starred_url = githubService.userStarUrl(uInfo.login);
          uInfo.followers_url = githubService.userFollowersUrl(uInfo.login);
          uInfo.following_url = githubService.userFollowingsUrl(uInfo.login);
          const loadUrl = [uInfo.repos_url, uInfo.starred_url, uInfo.followers_url, uInfo.following_url];
          console.log(loadUrl)
          console.log(pageCtx.data.loadTabType)
          const targeUrl = loadUrl[pageCtx.data.loadTabType]
          pageCtx.setData({
            gitHubUserInfo: uInfo,
            currentListUrl: targeUrl
          })
          pageCtx.data.currentListUrl = targeUrl
          pageCtx.loadList();
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    requestList = []
    this.loadList();
    pageCtx = this;
    const windH = app.globalData.sysInfo.windowHeight;
    pageCtx.setData({
      repoHeight: (windH + 28) + "px"
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    const length = requestList.length
    for (let i = 0; i < length; i++) {
      if (requestList[i]) {
        requestList[i].abort()
      }

    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.listData.length >= perpage) {
      page++;
      pageCtx.loadList();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})