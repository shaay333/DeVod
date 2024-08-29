import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import './CreatePost.css'
import {
  TextField,
  Container,
  StylesProvider,
  Typography,
  Button,
  IconButton,
  MenuItem,
} from '@material-ui/core'
import { NFTStorage, File } from 'nft.storage/dist/bundle.esm.min.js'
import { createRef } from 'react'
import { apiKey } from '../../APIKEYS'

function CreatePost() {
  // Add variables
  const history = useHistory()
  const [image, setImage] = useState('')
  const postTypeRef = createRef()
  const [postName, setPostName] = useState('')
  const [loading, setLoading] = useState(false)
  const [ownerName, setOwnerName] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageType, setImageType] = useState('')
  const [postType, setPostType] = useState('')

  const handleImage = (event) => {
    setImage(event.target.files[0])
    setImageName(event.target.files[0].name)
    setImageType(event.target.files[0].type)
  }

  const handleSubmit = async (event) => {
      event.preventDefault()
    try {
      setLoading(true)
      const client = new NFTStorage({ token: apiKey })
      const metadata = await client.store({
        name: postName,
        description: `${ownerName}, ${postType}`,
        image: new File([image], imageName, { type: imageType }),
      })
      if (metadata) {
        history.push('/')
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <StylesProvider injectFirst>
      <Container
        className="root-create-post"
        style={{ minHeight: '90vh', paddingBottom: '3rem' }}
      >
        <div>
          <Typography className="title" color="textPrimary" gutterBottom>
            Add a photo for your post
          </Typography>
          
          {/* Add Form */}
          {
            image ? (
              <img src={URL.createObjectURL(image)} alt="post" className="img-preview" />
            ) : (
              ''
            )
          }
          <div className="form-container">
            <form className="form" noValidate autoComplete="off">
              <input
                accept="image/*"
                className="input"
                id="icon-button-photo"
                defaultValue={image}
                onChange={handleImage}
                type="file"
              />
              <label htmlFor="icon-button-photo">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Post's name"
                variant="outlined"
                className="text-field"
                defaultValue={postName}
                onChange={(e) => setPostName(e.target.value)}
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="Owner's name"
                variant="outlined"
                className="text-field"
                defaultValue={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
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
                onClick={handleSubmit}
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

export default CreatePost
