const baseurl ="https://api.github.com/";

//获取制定用户的star列表
const userStarListUrl = login => {
  return baseurl + "users/" + login+"/starred";
}

//获取制定用户的仓库列表
const userRepoListUrl = login => {
  return baseurl + "users/" + login + "/repos";
}

module.exports = {
  userStarUrl: userStarListUrl,
  userRepoUrl : userRepoListUrl
}