import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid, Paper } from '@material-ui/core'
import '../home-container/gallery/PostGallery.css'
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { token } from '../../WEB3_TOKEN'
import { Link } from 'react-router-dom'
import { SettingsInputAntenna } from '@material-ui/icons';
import { PropTypes } from '@material-ui/core';
import withStyles from '@material-ui/core';
import { currentHash, currentDescription, currentTitle, videos } from '../video-gallery/VideoGallery';
import '../video-gallery/VideoGallery.css'
import './VideoPlayer.css'

export default function VideoPlayer({ account, contractData }) {

    const [hash, setHash] = useState(currentHash)
    const [title, setTitle] = useState(currentTitle)
    const [description, setDescription] = useState(currentDescription)
    const [posts, setPosts] = useState([]);

    const changeVideo = (latestHash, latestTitle, latestDescription) => {
        setHash(latestHash)
        setTitle(latestTitle)
        setDescription(latestDescription)
    }

    useEffect(() => {
        console.log(currentHash)
        console.log(currentTitle)
        console.log(currentDescription)
        console.log(videos)
        setPosts(videos);
    },[description, title, hash])

  return (
    <div>
        <div className="row">
          <Grid container spacing={12}>
          <div className="col-md-10 col1">
            <Grid item xs={20} style={{paddingLeft: 0, paddingRight: 0}}>
            <div
              className="embed-responsive embed-responsive-16by9 video"
              style={{ maxheight: "720px" }}
            >
              <video
                src={`https://w3s.link/ipfs/${hash}`}
                controls
              ></video>
            </div>
            <div className="mt-3 ml-5 videoInfo">
              <h3>
                <b>
                  <i className="video-title">{title}</i>
                </b>
              </h3>
              <b>Description:</b>
              <p className='videoDescription'>{description}</p>
              <br />
              <br />
              <div className="mt-3">
                <p>
                  <b>IPFS CID: </b>
                  <span>
                    {hash}
                  </span>
                </p>
                <p>
                  <b>Share IPFS URL: </b>
                  <a
                    href={`https://w3s.link/ipfs/${currentHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >{`https://w3s.link/ipfs/${hash}`}</a>
                </p>
              </div>
            </div>
            
            </Grid>
          </div>
          <div
            className="video-feed col-md-2 border border-secondary overflow-auto text-center"
            style={{ maxHeight: "1400px", minWidth: "240px" }}
          >
            <Grid item xs={20} style={{paddingLeft: 0, paddingRight: 0}}>
              <Paper>
            <h5 className="feed-title">
              <b>
                Video Feed
                <span role="img" aria-label="video-emote">
                  📺
                </span>
              </b>
            </h5>
            {posts.map((video, key) => {
              return (
                <Paper>
                <div
                  className="card mb-4 text-center bg-secondary mx-auto"
                  style={{ width: "320px", height: "200px" }}
                  key={key}
                >
                  <div>
                    <p
                      onClick={() =>
                        changeVideo(video.hash, video.title, video.description)
                      }
                    >
                      <video
                        src={`https://w3s.link/ipfs/${video.hash}`}
                        style={{ width: "260px", height: "120px" }}
                      />
                    </p>
                  </div>
                  <div className="card-title bg-dark videoTitle">
                    <small className="text-white">
                      <b>{video.title}</b>
                    </small>
                  </div>
                </div>
                </Paper>
            );
            })}
            </Paper>
            </Grid>
          </div>
          </Grid>
        </div>
    </div>
  )
}
