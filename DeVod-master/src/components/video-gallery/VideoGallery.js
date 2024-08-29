import React, { useEffect, useState, useRef  } from 'react'
import { useHistory, Link } from "react-router-dom";
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid, Paper } from '@material-ui/core'
import '../home-container/gallery/PostGallery.css'
import VideoPlayer from '../videoplayer/VideoPlayer'
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { token } from '../../WEB3_TOKEN'
import './VideoGallery.css'

// export const [hash, setHash] = useState("");
// export const [title, setTitle] = useState("");
// export const [description, setDescription] = useState("");
export var currentHash = ""
export var currentTitle = ""
export var currentDescription = ""
export var videos = []

export default function VideoGallery({ account, contractData }) {
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [videoCount, setVideocount] = useState(0);
    const [hash, setHash] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reload, setReload] = useState(false);
    const [posts, setPosts] = useState(new Set());

    const prevData = useRef([]);

    const history = useHistory();

    const dtube = contractData;

    const client = new Web3Storage({ token: token });
  
    useEffect(() => {
      const loadPosts = async () => {
        try {
            setLoading(true);
            const videosCount = await contractData.methods.videoCount().call()
            // console.log(videosCount);
            setVideocount(videosCount);
            console.log("posts "+postsData.length);
            // console.log(postsData);

            // Load videos, sort by newest
            // for (var i = videosCount; i >= 1; i--) {
            //     const video = await contractData.methods.videos(i).call();
            //     prevData.current = video
            //     // console.log(prevData.current)
            //     // setPosts()
            //     if(!postsData.includes(video))
            //       setPostsData([...postsData, video])
            //     // console.log("i"+i);
            // }

            const latest = await contractData.methods.videos(videosCount).call();
            setHash(latest.hash)
            setTitle(latest.title)
            setDescription(latest.description)
            currentHash = latest.hash
            currentTitle = latest.title
            currentDescription = latest.description
            videos = postsData
            setLoading(false)
            setReload(true)
        } catch (error) {
            window.alert(
                'Connect wallet or DeTube Contract is not deployed to the detected network. Connect to the correct network!',
              )
            console.log(error)
            setLoading(false)
        }
      }
      loadPosts()
      setReload(true)
    }, [videoCount, hash, title, description])

    useEffect(() => {
      const loadData = async () => {
        const videosCount = await contractData.methods.videoCount().call()
            // console.log(videosCount);
            console.log("posts "+postsData.length);
            // console.log(postsData);

            // Load videos, sort by newest
            for (var i = videosCount; i >= 1; i--) {
                const video = await contractData.methods.videos(i).call();
                if(!postsData.includes(video))
                  setPostsData(postsData => [...postsData, video])
            }
      }
      loadData()
    }, [])

    const handleClick = async (latestHash, latestTitle, latestDescription) => {
        console.log("clicked!!");
        // const videosCount = await contractData.methods.videoCount().call()
        // const vids = await contractData.methods.videos().call();
        currentHash = latestHash
        currentTitle = latestTitle
        currentDescription = latestDescription
        videos = postsData
        history.push("/video");
    }
  
    return (
      <div style={{ minHeight: '70vh', paddingBottom: '3rem' }}>
         {/* Add post's Data */}
         {
          loading ? (
            <CircularStatic />
          ) : (
            <div>
              <div style={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  {postsData.length ? (
                      postsData.map((video, key) => (
                      // console.log("posts"+postsData.length)
                      // console.log(postsData)
                      // return (
                        <Paper className='paper'>
                        <div
                        className="card mb-4 text-center bg-secondary mx-auto gallery"
                        style={{ width: "500px", height: "380px" }}
                        key={key}
                        >
                          <div className='videoGallery'>
                            <h3 className="text-white title">
                              <b>{video.title}</b>
                            </h3>
                            <div
                            onClick={function() {handleClick(video.hash, video.title, video.description)}}
                            >
                              <video
                                  src={`https://w3s.link/ipfs/${video.hash}`}
                                  style={{ width: "440px", height: "240px" }}
                              />
                              <div className='videoInfo'>
                                  <p>
                                      {<span><b>by:</b> {video.author}</span>}
                                      <br/>
                                      <b>Description:</b> {video.description}
                                  </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        </Paper>
                      // );
                      ))) : (
                          <h2>No Videos Yet...</h2>
                      )
                  }
                </Grid>
              </div>
              <div className='uploadLink'>
                <br />
                <br />
                <br />
                  Share a video?
                  <Link to="/upload-video">Click here</Link>
              </div>
            </div>
          )
        }
  
      </div>
    )
}
