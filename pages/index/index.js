//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
var thisCxt = null;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: "../image/githublogo.png"
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gitHubUserName: "",
    gitHubUserPassword: "",
    basicAuthization: null,
    oauthToken: null
  },
  updateName: function (e) {
    thisCxt.setData({
      gitHubUserName: e.detail.value
    });
  },
  updatePassword: function (e) {
    thisCxt.setData({
      gitHubUserPassword: e.detail.value
    });
  },
  //登录按钮点击事件
  loginGitHub: function (e) {
    wx.showLoading({
      title: '登录中',
    })
    //登录github
    const uname = thisCxt.data.gitHubUserName
    const upwd = thisCxt.data.gitHubUserPassword
    if (!uname) {
      wx.showToast({
        title: '请输入用户名',
      })
      return
    }
    if (!upwd) {
      wx.showToast({
        title: '请输入密码',
      })
      return
    }
    var tokenParams = app.globalData.createTokenParams
    tokenParams.note = "wechatApp-" + util.formatTime(new Date())

    const basicAuthor = "Basic " + util.base64Encode(this.data.gitHubUserName + ":" + this.data.gitHubUserPassword)
    console.log(this.data.gitHubUserName + ":" + this.data.gitHubUserPassword);
    const authUrl = app.globalData.gitHubApiBaseUrl + "/authorizations"
    util.formatTime(new Date())
    wx.request({
      url: authUrl,
      method: "POST",
      dataType: "JSON",
      header: {
        "Authorization": basicAuthor
      },
      data: tokenParams,
      success: function (res) {

        console.dir(res);
        const resData = res.data;
        const resDataBean = JSON.parse(resData);
        console.dir(resDataBean);
        if (resDataBean.token) {
          wx.hideLoading()
          wx.setStorageSync("basicToken", basicAuthor);
          wx.setStorageSync("AuthToken", "token " + resDataBean.token);
          thisCxt.setData({
            basicAuthization: basicAuthor,
            oauthToken: resDataBean.token
          });
        } else {
          wx.showToast({
            title: '用户名或密码错误',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }

      }
    })
  },
  myRepositories: function () {
    wx.navigateTo({
      url: '../personal/myRepositories/myRepolist',
    })
  },
  myStars: function () {
    wx.navigateTo({
      url: '../personal/myStars/myStarList',
    })
  },
  userLogOut:function(res){

  },
  onLoad: function () {

    thisCxt = this
    //从本地存储中获取basic auth数据
    const basicAuthization = wx.getStorageSync('basicToken') || null
    //从本地存储中获取authtoken数据
    const oauthToken = wx.getStorageSync('AuthToken') || null
    const baseUrl = app.globalData.gitHubApiBaseUrl
    const authUrl = baseUrl + "/authorizations"
    const authSendParam = app.globalData.createTokenParams
    if (basicAuthization && oauthToken) {
      //有授权token
      thisCxt.setData({
        basicAuthization: basicAuthization,
        oauthToken: oauthToken
      });
      wx.showLoading({
        title: 'log in',
      })
      wx.request({
        url: baseUrl + "/user",
        header: {
          "Authorization": basicAuthization
        },
        success: function (res) {
          wx.hideLoading()
          console.dir(res);
          wx.setStorageSync("userName", res.data.login);
          thisCxt.setData({
            userInfo: {
              avatarUrl: res.data.avatar_url
            },
          })
        }
      })
    }
  }

})
