import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Home from './components/home-container/home/Home'
import PostDetails from './components/home-container/post-details/PostDetails'
import VideoGallery from './components/video-gallery/VideoGallery'
import VideoPlayer from './components/videoplayer/VideoPlayer'
import VideoUpload from './components/add-video/VideoUpload'
import CreatePost from './components/create-post/CreatePost'
import Web3 from 'web3'
import MyPost from './abis/Post.json'
import Detube from './abis/DeTube.json'
import { useState } from 'react'

function App() {
  // Add variables
  const [account, setAccount] = useState('')
  const [postContractData, setPostContractData] = useState('')
  const [detubeContractData, setDetubeContractData] = useState('')

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying Metamask!',
      )
    }
  }

  const getContract = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId()
    const postNetworkData = MyPost.networks[networkId]
    const detubeNetworkData = Detube.networks[networkId]

    if (postNetworkData) {
      const abi = MyPost.abi
      const address = MyPost.networks[networkId].address
      const myContract = new web3.eth.Contract(abi, address)
      setPostContractData(myContract)
    } else {
      window.alert(
        'Posts Contract is not deployed to the detected network. Connect to the correct network!',
      )
    }
    
    if(detubeNetworkData) {
      const abi = Detube.abi
      const address = Detube.networks[networkId].address
      const myContract = new web3.eth.Contract(abi, address)
      setDetubeContractData(myContract)
    } else {
      window.alert(
        'DeTube Contract is not deployed to the detected network. Connect to the correct network!',
      )
    }
  }

  const connectWallet = async () => {
    await loadWeb3()
    await getContract()
  }

  return (
    <Router>
      <div className="cl">
        <Navbar account={account} connectWallet={connectWallet} />
        <Route exact path="/" component={Home} />
        <Switch>
          <Route exact path="/create-post" component={CreatePost} />
          <Route path="/post-details/:postId">
            <PostDetails account={account} contractData={postContractData} />
          </Route>
        </Switch>
        <Route exact path="/detube">
            <VideoGallery account={account} contractData={detubeContractData} />
        </Route>
        <Route exact path="/upload-video">
            <VideoUpload account={account} contractData={detubeContractData} />
        </Route>
        <Route exact path="/video">
            <VideoPlayer account={account} contractData={detubeContractData} />
        </Route>
        <Footer />
      </div>
    </Router>
  )
}

export default App
