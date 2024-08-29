const Post = artifacts.require('Post')
const DeTube = artifacts.require('DeTube')

module.exports = function (deployer) {
  deployer.deploy(Post)
  deployer.deploy(DeTube)
}