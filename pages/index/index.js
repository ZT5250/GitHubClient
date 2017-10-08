//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
var thisCxt = null;
var userName = null;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: "../image/githublogo.png",
      publicRepoCount: 0,
      followerCount: 0,
      followingCount: 0
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gitHubUserName: "",
    gitHubUserPassword: "",
    basicAuthization: null,
    oauthToken: null
  },
  showMyProfile:function(){
    const myUserName = wx.getStorageSync("userName");
    wx.navigateTo({
      url: '../personal/userprofile/userprofile?userName=' + myUserName,
    })
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
    wx.getSystemInfo({
      success: function (res) {
        console.dir(res)
        tokenParams.note = "wechatApp-" + res.model+"-" + util.formatTime(new Date())

        const basicAuthor = "Basic " + util.base64Encode(thisCxt.data.gitHubUserName + ":" + thisCxt.data.gitHubUserPassword)
        const baseUrl = app.globalData.gitHubApiBaseUrl;
        const authUrl = baseUrl + "/authorizations"
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
              //获取用户信息
              wx.request({
                url: baseUrl + "/user",
                header: {
                  "Authorization": basicAuthor
                },
                success: function (res) {
                  wx.setStorageSync("userName", res.data.login);
                  thisCxt.setData({
                    userInfo: {
                      avatarUrl: res.data.avatar_url,
                      publicRepoCount: res.data.public_repos,
                      followerCount: res.data.followers,
                      followingCount: res.data.following
                    },
                  })
                }
              })
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
      }
    })
    
  },
  myRepositories: function () {
    if (userName==null){
      userName = wx.getStorageSync("userName");
    }
    const url = 'https://api.github.com/users/' + userName + '/repos'
    wx.navigateTo({
      url: '../personal/userprofile/userprofile?userName=' + userName + '&tabType=0&datatype=1&url=' + url,
    })
    // wx.navigateTo({
    //   url: '../personal/myRepositories/myRepolist',
    // })
  },
  myStars: function () {
    if (userName == null) {
      userName = wx.getStorageSync("userName");
    }
    const url = 'https://api.github.com/users/' + userName + '/starred'
    wx.navigateTo({
      url: '../personal/userprofile/userprofile?userName=' + userName + '&tabType=1&datatype=1&url=' + url,
    })
    // wx.navigateTo({
    //   url: '../personal/myStars/myStarList',
    // })
  },
  myFollowers: function (option) {
    if (userName == null) {
      userName = wx.getStorageSync("userName");
    }
    const url = 'https://api.github.com/users/' + userName + '/followers'
    wx.navigateTo({
      url: '../personal/userprofile/userprofile?userName=' + userName + '&tabType=2&datatype=2&url=' + url,
    })
    // wx.navigateTo({
    //   url: '../followers/users',
    // })
  },
  myFollowings: function (option) {
    if (userName == null) {
      userName = wx.getStorageSync("userName");
    }
    const url = 'https://api.github.com/users/' + userName+'/following'
    wx.navigateTo({
      url: '../personal/userprofile/userprofile?userName=' + userName + '&tabType=3&datatype=2&url=' + url,
    })
    // wx.navigateTo({
    //   url: '../followings/users',
    // })
  },
  onShow:function(res){
    thisCxt = this
  },
  onReady: function () {
    //从本地存储中获取basic auth数据
    const basicAuthization = wx.getStorageSync('basicToken') || null
    const baseUrl = app.globalData.gitHubApiBaseUrl
    if (basicAuthization) {
      wx.showLoading({
        title: 'log in',
      })
      //获取用户信息
      wx.request({
        url: baseUrl + "/user",
        header: {
          "Authorization": basicAuthization
        },
        success: function (res) {
          wx.hideLoading()
          app.globalData.gitHubUser = res.data;
          wx.setStorageSync("userName", res.data.login);
          thisCxt.setData({
            userInfo: {
              avatarUrl: res.data.avatar_url,
              publicRepoCount: res.data.public_repos,
              followerCount: res.data.followers,
              followingCount: res.data.following
            },
          })
        }
      })
    }

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
      //获取用户信息
      wx.request({
        url: baseUrl + "/user",
        header: {
          "Authorization": basicAuthization
        },
        success: function (res) {
          wx.hideLoading()
          app.globalData.gitHubUser = res.data;
          wx.setStorageSync("userName", res.data.login);
          thisCxt.setData({
            userInfo: {
              avatarUrl: res.data.avatar_url,
              publicRepoCount: res.data.public_repos,
              followerCount: res.data.followers,
              followingCount: res.data.following
            },
          })
        }
      })
    }
  }

})
