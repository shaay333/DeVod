# DeVod
DeVod is a decentralized video sharing & social media platform on Ethereum blockchain.

DeVod is a decentralized version of the Instagram platform where users can browse photos, see details of a specific posts, create a post and earn NFTS, uploads the photo files to IPFS by using nft.storage and stores those IPFS CIDs to the blockchain network.

And it has a video sharing platform DeTube, it uploads the video files to IPFS by using web3.storage and stores those IPFS CIDs to the blockchain network.

## Demo
- [Home Page](https://nameless-heart-3261.on.fleek.co/)


# Development instructions
## Installation 
Make sure you have truffle installed on your computer.
### `npm install -g truffle`

Install dependencies
### `npm i`

Compile the smart contracts
### `truffle compile`

Deploy the smart contract
### `truffle migrate --network matic`

Make sure to add your 12 word Secret Recovery Phrase of your (preferably newly generated and testnet-only) MetaMask wallet in .env with the variable name REACT_APP_MNEMONIC. This will be loaded by truffle at runtime, and the environment variable can then be accessed with process.env.REACT_APP_MNEMONIC.

For development and testing, you have to create your own web3.storage API token. To do that, login to web3.storage -> create a new API token -> copy the API token
Then start the application...
### `npm start`

or
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

OR, To develop on ganache blockchain, open ganache and import the accounts by adding your ganache private keys in MetaMask.
### `truffle migrate`

> ⚠️ If dealing with “JavaScript heap out of memory” error after `npm start` then use the following command to solve it: For Linux/macOs: `export NODE_OPTIONS="--max-old-space-size=8192"` 
For Windows: `$env:NODE_OPTIONS="--max-old-space-size=8192"`

# How it's made
DeVod application makes use of the following softwares:
* Deployed smart contracts on the `Polygon (Matic)` Mumbai test network.
* Used `Truffle & MetaMask`.
* Upload and store files to `IPFS NFTStorage` [IPFS](https://nft.storage/) platform.
* Upload and store video files to `IPFS Web3Storage` [IPFS](https://web3.storage/) platform.
* Built two simple `Solidity ` smart contract, one for minting NFTs, creating posts and operations interacting with the contract and the other for video sharing (DeTube)
* `OpenZeppelin` Library to customize smart contract
* Develop, deploy, and run tests the application with `Ganache` (local blockchain)
* Build and use `React Js` to create components for single-page applications.
* `Material-UI` to build faster, beautiful, and more accessible React applications.

* [nft.storage usgae in the DApp(line 40)](https://github.com/Mohd-Taqiuddin/DeVod/blob/master/src/components/create-post/CreatePost.js)
* [web3.storage usgae in the DApp(line 36)](https://github.com/Mohd-Taqiuddin/DeVod/blob/master/src/components/add-video/VideoUpload.js)


# Host the DApp on IPFS using Fleek
You cannot call this project a "Decentralized Application" if you are hosting it on any centralized server. To make it decentralized, again we're going to use IPFS.
Create a new repository on GitHub and push all the changes.
Sign up on Fleek -> Add new site -> Connect GitHub repo -> select framework (React in our case) -> Deploy Site
That's it! you'll get the fleek link of your DApp after deploying the site, you can assign a domain and share your DApp link with anyone in the world.
