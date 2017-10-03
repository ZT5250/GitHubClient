const baseurl ="https://api.github.com/";


const userInfoUrl = userName => {
  return baseurl + "users/" + userName
}

//获取制定用户的star列表
const userStarListUrl = login => {
  return baseurl + "users/" + login+"/starred";
}

//获取制定用户的仓库列表
const userRepoListUrl = login => {
  return baseurl + "users/" + login + "/repos";
}

//获取制定用户的follower列表
const userFollowerListUrl = login => {
  return baseurl + "users/" + login + "/followers";
}

//获取制定用户的followings列表
const userFollowingListUrl = login => {
  return baseurl + "users/" + login + "/following";
}

module.exports = {
  userStarUrl: userStarListUrl,
  userRepoUrl : userRepoListUrl,
  userFollowersUrl: userFollowerListUrl,
  userFollowingsUrl: userFollowingListUrl,
  userUrl: userInfoUrl
}