var page = 1, perpage = 3;
const githubService = require("../../../utils/githubservice.js")
const app = getApp();  //获取微信小程序实例
var requestTask = null
var pageCtx = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repolist: [],
    isRequest: false,
    scrollHeight: "400px",
    inputOpacity: 1,
    scrollTop: 0,
    starUrl: "",
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
  loadRepoList: function () {
    //加载当前登录用户的star列表
    const oauthToken = wx.getStorageSync('AuthToken') || null
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.setNavigationBarTitle({
      title: '加载中',
    })
    requestTask = wx.request({
      url: pageCtx.data.starUrl + "?page=" + page + "&per_page=" + perpage,
      header: {
        "Authorization": oauthToken
      },
      success: function (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.setNavigationBarTitle({
          title: 'my stars',
        })

        var repolist = res.data;
        if (repolist.length == 0) {
          if (page > 1) {
            page--;
          }
          wx.showToast({
            title: '没有数据',
            icon: 'success',
            duration: 1200
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 300)
        } else {
          wx.hideLoading()
        }
        if (page > 1) {
          pageCtx.setData({
            repolist: pageCtx.data.repolist.concat(repolist)
          })
        } else {
          pageCtx.setData({
            repolist: repolist
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userName = wx.getStorageSync("userName");
    const starUrl = githubService.userStarUrl(userName);
    pageCtx = this;
    pageCtx.setData({
      starUrl: starUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    page = 1;
    pageCtx.loadRepoList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    requestTask = null;
    pageCtx = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (requestTask != null) { requestTask.abort() }
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
    page = 1;
    this.setData({
      repolist: []
    })
    pageCtx.loadRepoList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page++;
    pageCtx.loadRepoList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})