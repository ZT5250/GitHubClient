//app.js

App({
  globalData: {
    userInfo: null,
    gitHubUser:null,
    viewGitHubUser:null,
    appID: "wxa65ef0fee336238a",
    appSecret: "72517e838d1c37765ca62d3b3c326363",
    gitHubApiBaseUrl: "https://api.github.com",
    openID: null,
    sessionKey: null,
    repoDetailUrl: null,
    clickRepoFullName:null,
    gitHubScope: [],
    createTokenParams: {
      "scopes": [
        "admin:gpg_key", "admin:org", "admin:org_hook",
        "admin:public_key","admin:repo_hook",
        "delete_repo","gist","notifications","repo","user"
      ],
      "note": "builtWechatApp"
    }
  },
  onLaunch: function () {
    var appContext = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.dir(res);
        //到后台换取openId, sessionKey, unionId
        const openIdUrl = appContext.initOpenIdUrl(res.code);
        wx.request({
          url: openIdUrl,
          success: function (res) {
            console.dir(res);
            const opendata = res.data
            appContext.globalData.openID = opendata.openid
            appContext.globalData.sessionKey = opendata.session_key
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  initOpenIdUrl: function (loginResCode) {
    //根据登录返回的code拼接获取openID的开放接口路径
    return "https://api.weixin.qq.com/sns/jscode2session?appid=" + this.globalData.appID + "&secret=" + this.globalData.appSecret + "&js_code=" + loginResCode + "&grant_type=authorization_code"
  }

})