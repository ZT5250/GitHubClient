var page = 1, perpage = 6;
var queryKey = "java";
const app = getApp();  //获取微信小程序实例
Page({
  data: {
    repolist: [],
    isRequest: false,
    scrollHeight: "400px",
    inputOpacity: 1,
    scrollTop: 0
  },
  bindKeyInput: function (e) {
    queryKey = e.detail.value;
  },
  searchRepoList: function () {
    wx.showLoading({
      title: '加载中',
    })
    page = 1;
    this.setData({
      scrollTop: 0
    })
    this.loadRepoList(queryKey);
  },
  onPullDownRefresh:function(e){
    wx.showLoading({
      title: '加载中',
    })
    page = 1;
    this.loadRepoList(queryKey);
  },
  onReachBottom:function(){
    page++;
    this.loadRepoList(queryKey);
  },
  showRepoDetail: function (e) {
    const clickData = e.currentTarget.id;
    const splitData = clickData.split(";");
    const repoUrl = splitData[0];

    app.globalData.repoDetailUrl = repoUrl
    app.globalData.clickRepoFullName = splitData[1]

    wx.navigateTo({
      url: '../repo-detail/repoDetail',
    })
  },
  loadRepoList: function (keyword) {

    if (!this.data.isRequest) {
      this.setData({
        isRequest: true
      });
      var repoThis = this;
      wx.showNavigationBarLoading() //在标题栏中显示加载
      wx.setNavigationBarTitle({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.gitHubApiBaseUrl + "/search/repositories?q=" + keyword + "&page=" + page + "&per_page=" + perpage,
        success: function (res) {

          wx.hideNavigationBarLoading() //完成停止加载
          wx.setNavigationBarTitle({
            title: 'github-repository',
          })

          repoThis.setData({
            isRequest: false
          });
          // = res.data.items;
          var repolist = res.data.items;
          if (repolist.length == 0) {
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
            repoThis.setData({
              repolist: repoThis.data.repolist.concat(repolist)
            })
          } else {
            repoThis.setData({
              repolist: repolist
            })
          }

        }
      })
    }

  },
  onLoad: function () {
    console.dir(app.globalData)
    wx.showLoading({
      title: '加载中',
    })
    this.loadRepoList(queryKey);
    var appContent = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.screenHeight)
        console.log(res.screenWidth)
        appContent.setData({
          scrollHeight: (res.screenHeight - 50) + "px"
        });
        console.log(res.language)
        console.log(res.version)
      }
    })
  }
})