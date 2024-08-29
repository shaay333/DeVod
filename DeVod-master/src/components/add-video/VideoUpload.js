import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid } from '@material-ui/core'
import '../home-container/gallery/PostGallery.css'
import VideoPlayer from '../videoplayer/VideoPlayer'
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { token } from '../../WEB3_TOKEN'
import { Link } from 'react-router-dom'
import { SettingsInputAntenna } from '@material-ui/icons';
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import {
    TextField,
    Container,
    StylesProvider,
    Typography,
    MenuItem,
  } from '@material-ui/core'
import VideoFileIcon from '@mui/icons-material/VideoFile';
import '../video-gallery/VideoGallery.css';
import './VideoUpload.css';


function VideoUpload({ account, contractData }) {

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    // const [hash, setHash] = useState("")

    const client = new Web3Storage({ token: token });
    const dtube = contractData;
    const history = useHistory();

    const captureFile = (event) => {
        event.preventDefault();
        const file = document.querySelector('input[type="file"]');
        return setFile(file)
    };

    const upload= async () => {
        setLoading(true)
        try{
            console.log("Submitting file to IPFS...")
            const videoFile = file
            //adding file to the IPFS
            const cid = await client.put(videoFile.files, { wrapWithDirectory: false });
            // console.log(account)
            // console.log(description)
            contractData.methods
                .uploadVideo(cid, title, description)
                .send({ from: account })
                .on("transactionHash", (hash) => {
                    setLoading(false)
                    history.push("/detube");
            });

        }
        catch(e) {
            console.log(e)
            setLoading(false)
        }
    }

    // const handleChange = (event) => {
    //     SetInput(event.target.value)
    // }

    return (
        <StylesProvider injectFirst>
            <Container
                className="root-create-post"
                style={{ minHeight: '90vh', paddingBottom: '3rem' }}
            >
                <div>
                    <Typography className="title" color="textPrimary" gutterBottom>
                        Add a video to share
                    </Typography>
                    <div className="form-container1">
                        <form className="form1" noValidate autoComplete="off">
                        <input
                            accept=".mp4, .mov, .mkv .ogg .wmv"
                            className="input1"
                            id="icon-button-photo"
                            onChange={captureFile}
                            type="file"
                        />
                        <label htmlFor="icon-button-photo">
                            <IconButton color="primary" component="span">
                            <VideoFileIcon />
                            </IconButton>
                        </label>
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Video Title"
                            variant="outlined"
                            className="text-field1"
                            defaultValue={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            multiline
                            rows={4}
                            label="Video Description"
                            variant="outlined"
                            className="text-field1"
                            defaultValue={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {/* <TextField
                            fullWidth
                            name="petType"
                            select
                            label="Choose one option"
                            variant="outlined"
                            className="text-field"
                            onChange={(e) => setPetType(e.target.value)}
                            defaultValue=""
                            ref={petTypeRef}
                        > */}
                            {/* <MenuItem value="Cat">Cat</MenuItem>
                            <MenuItem value="Dog">Dog</MenuItem>
                            <MenuItem value="Bird">Bird</MenuItem>
                            <MenuItem value="Fish">Fish</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField> */}
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={ () =>{
                                upload();
                            }}
                        >
                            Submit
                        </Button>
                        </form>
                    </div>
                </div>
            </Container>
        </StylesProvider>
    )
}

export default VideoUpload