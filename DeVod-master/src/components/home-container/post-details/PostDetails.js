import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Grid,
  Container,
  Typography,
  Button,
  Card,
  StylesProvider,
} from '@material-ui/core'
import './PostDetails.css'
import { apiKey } from '../../../APIKEYS'
import {RiHeart3Fill,RiHeart3Line} from 'react-icons/ri';
import { dataPost } from '../gallery/PostGallery'


function PostDetails({ account, contractData }) {
  const { postId } = useParams()
  // Add state variables
  const [image, setPostImage] = useState('')
  const [postName, setPostName] = useState('')
  const [postOwner, setOwnerName] = useState('')
  const [postCategory, setPostCategory] = useState('')
  const [input, setInput] = useState('')
  const [comment, setComment] = useState([])
  const [codeHash, setCodeHash] = useState('')
  const [likes, setLikes] = useState(0)
  const [load, setLoad] = useState(0)
  const addresses = []

  useEffect(() => {
    if (postId) {
      getMetadata()
      getImage()
      // addresses.push(account);
      // addresses.push(account);
      // addresses.push(account);
      console.log('addresses'+addresses)
      // console.log(typeof(account))
      // console.log(addresses)
      loadData()
    }
  }, [postId, contractData, postName])

  const getImage = (ipfsURL) => {
    if (!ipfsURL) return
    ipfsURL = ipfsURL.split('://')
    return 'https://ipfs.io/ipfs/' + ipfsURL[1]
  }

  const getMetadata = async () => {
    let data = await fetch(`https://ipfs.io/ipfs/${postId}/metadata.json`)
    data = await data.json()
    const [postOwner, postCategory] = data.description.split(',')
    const imageFormated = getImage(data.image)
    setPostImage(imageFormated)
    setPostName(data.name)
    setOwnerName(postOwner)
    setPostCategory(postCategory)
  }

  const loadData = async () => {
    try {
      const totalLikes = await contractData.methods.likes(postName).call()
      // const commentsCount = await contractData.methods.commentCount().call()
      console.log('likes '+totalLikes)
      const commentData = await contractData.methods.comments(account, postName).call()
      console.log(commentData)
      // for (var i = commentsCount; i >= 1; i--) {
      //   const commentData = await contractData.methods.comments().call();
      //   setComment(comment => [...comment, commentData]);
      // }
      // console.log(dataPost)
      // console.log(postName)
      if(dataPost !== undefined && dataPost.name===postName){
        setLikes(totalLikes);
        setComment(comment => [...comment, commentData]);
      }
    } catch(e) {
      console.log(e);
      window.alert(
                'Connect wallet or Contract is not deployed to the detected network. Connect to the correct network!',
              )
    }
    
  }

  const mintNFT = async (postId) => {
    try {
      const data = await contractData.methods
        .mintNFT(`https://${postId}`)
        .send({ from: account })
  
      setCodeHash(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (event) => {
    setInput(event.target.value);
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    setComment(comment => [...comment, input])
    const data = await contractData.methods
      .commentOperation(input, postName)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setInput('')
      });
  }

  const toggleLike = async (account) => {
    var index = addresses.indexOf(account);
    console.log(index);
    console.log(addresses);
    if(index === -1){
      const like = await contractData.methods
        .likeIncrement(postName)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          addresses.push(account);
          console.log('push...'+addresses);
          setLikes(likes+1);
        });
    }
//     } else {
//       const like = await contractData.methods
//       .likeDecrement(postName)
//       .send({ from: account })
//       .on("transactionHash", (hash) => {
//         addresses.splice(index, 1);
//         console.log('splice...'+addresses)
//       });
//       // var index = addresses.indexOf(account);
//       // if (index !== -1) {
//       // }
//       setLikes(likes-1);
//     }
  }

  return (
    <StylesProvider injectFirst>
      <Container
        className="root-post-details"
        style={{ minHeight: '85vh', paddingBottom: '3rem' }}
      >
        <div className="">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className="grid-container">
              {/* Add post details */}
              <div className="flex-container">
                <h2>{`${postName}`}</h2>
                { 
                  codeHash.transactionHash? <Button
                  variant="contained"
                  className="wallet-btn"
                  color="primary"
//                   onClick={mintNFT}
                >
                  NFT Minted
                </Button>:<Button
                  variant="contained"
                  className="wallet-btn"
                  color="primary"
                  onClick={mintNFT}
                >
                  Mint NFT
                </Button>
              }
              </div>

              <img className="img" src={image} alt="post" />
              <div className="flex-container">
                <div>
                  {/* <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton> */}
                  <IconButton
                    edge="end"
                    aria-label="likes"
                    onClick={() => {toggleLike(account)}}
                    color="inherit"
                  >
                    <Typography variant="body1" color="primary">
                      {likes}
                    </Typography>
                    {
                      (likes>0)? <RiHeart3Fill /> : <RiHeart3Line />
                    }
                  </IconButton>

                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </div>
              </div>

              <Typography gutterBottom variant="subtitle1" className="details-text">
                Post Details
              </Typography>

              <Typography variant="body2" gutterBottom className="details-text">
                Full rights and credits to the owner @{postOwner}...
              </Typography>

              
            </Grid>

            <Grid item xs={12} sm={6}>
              {/*Add Transaction Confirmation: */}
              {
                codeHash ? (
                  <Card className="code-hash">
                    <Typography gutterBottom variant="subtitle1">
                      Confirmation Transaction:
                    </Typography>
                    <p>
                      TransactionHash: <span>{codeHash.transactionHash}</span>{' '}
                    </p>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={'https://mumbai.polygonscan.com/tx/' + codeHash.transactionHash}
                    >
                      <Button variant="contained" color="primary" className="wallet-btn">
                        See transaction
                      </Button>
                    </a>
                  </Card>
                ) : (
                  ''
                )
              }

              {/* Add form */}
              <form noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  label="Comment"
                  variant="outlined"
                  value={input}
                  onChange={handleChange}
                  className="text-field"
                />
              </form>
              <Button type="submit" variant="contained" onClick={handleSubmit}>
                Add comment
              </Button>

              {/* Display comments  */}
              {
                comment ? (
                  <ListItem style={{ paddingLeft: '0px' }}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" />
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className="inline"
                            color="textPrimary"
                          >
                            {account}:
                          </Typography>
                          {` ${comment}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ) : (
                  <h2>No comments</h2>
                )
              }
            </Grid>
          </Grid>
        </div>
      </Container>
    </StylesProvider>
  )
}

export default PostDetails
