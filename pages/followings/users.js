var page = 1, perpage = 50;
const githubService = require("../../utils/githubservice.js")
const app = getApp();  //获取微信小程序实例
var pageCtx = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    followersUrl:"",
    oauthToken:""
  },

loadeFollowers:function(){
  wx.showNavigationBarLoading() //在标题栏中显示加载
  wx.setNavigationBarTitle({
    title: 'loading',
  })
  wx.request({
    url: pageCtx.data.followersUrl + "?page=" + page + "&per_page=" + perpage,
    header: {
      "Authorization": pageCtx.data.oauthToken
    },
    success: function (res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.setNavigationBarTitle({
        title: 'my followings',
      })

      var userlist = res.data;
      if (userlist.length == 0) {
        if (page > 1) {
          page--;
        }
        wx.showToast({
          title: 'no more data',
          icon: 'success',
          duration: 1200
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 300)
      } else {
        wx.hideLoading()

        if (page > 1) {
          pageCtx.setData({
            userList: pageCtx.data.userList.concat(userlist)
          })
        } else {
          pageCtx.setData({
            userList: userlist
          })
        }
      }
      
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userName = wx.getStorageSync("userName");
    const followersUrl = githubService.userFollowingsUrl(userName);
    const oauthToken = wx.getStorageSync('AuthToken') || null;
    pageCtx = this;
    pageCtx.setData({
      followersUrl: followersUrl,
      oauthToken: oauthToken
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    page = 1;
    pageCtx.setData({
      userList: []
    })
    this.loadeFollowers();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (pageCtx.data.userList == perpage) {
      page++;
      pageCtx.loadeFollowers();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})