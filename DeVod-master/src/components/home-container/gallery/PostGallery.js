import React, { useEffect, useState } from 'react'
import CircularStatic from '../../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid } from '@material-ui/core'
import './PostGallery.css'
import { apiKey } from '../../../APIKEYS'
import { Link, useHistory } from 'react-router-dom'

export var dataPost = []

function PostGallery() {
  const [postsData, setPostsData] = useState([])
  const [loading, setLoading] = useState(false)

  const history = useHistory();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        let cids = await fetch('https://api.nft.storage', {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        })
        cids = await cids.json()
        const temp = []
        for (let cid of cids.value) {
          if (cid?.cid) {
            let data = await fetch(
              `https://ipfs.io/ipfs/${cid.cid}/metadata.json`,
            )
            data = await data.json()
  
            const getImage = (ipfsURL) => {
              if (!ipfsURL) return
              ipfsURL = ipfsURL.split('://')
              return 'https://ipfs.io/ipfs/' + ipfsURL[1]
            }
  
            data.image = await getImage(data.image)
            data.cid = cid.cid
            data.created = cid.created
            temp.push(data)
          }
        }
        setPostsData(temp);
        // dataPost = temp;
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    loadPosts()
  }, [])

  const handleClick = (post) => {
    dataPost = post;
    let url = '/post-details/'+post.cid
    history.push(url);
  }

  return (
    <div style={{ minHeight: '70vh', paddingBottom: '3rem' }}>
       {/* Add post's Data */}
       {
        loading ? (
          <CircularStatic />
        ) : (
          <div style={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              {postsData.length ? (
                postsData.map((post, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <ImageListItem style={{ height: '320px', listStyle: 'none' }}>
                      <img src={post.image} alt={post.name} />
                      <ImageListItemBar
                        title={post.name}
                        subtitle={<span>by: {post.description}</span>}
                        actionIcon={
                          <IconButton
                            aria-label={`info about ${post.name}`}
                            className="icon"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              // component={Link}
                              // to={`/post-details/${post.cid}`}
                              onClick={() => {handleClick(post)}}
                              className="view-btn"
                            >
                              View
                            </Button>
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  </Grid>
                ))
              ) : (
                <h2>No Posts Yet...</h2>
              )}
            </Grid>
          </div>
        )
      }

    </div>
  )
}

export default PostGallery
