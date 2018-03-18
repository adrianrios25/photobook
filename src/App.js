import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import Dropzone from 'react-dropzone'

axios.defaults.baseURL = 'http://localhost';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

let userData = {
  user: {
    name: 'Adrian',
    images: [
      {
        title: 'sunset',
        story: 'Sunset in Batangas.',
        imageurl: './assets/images/sunset.jpg'
      },
      {
        title: 'Puppy',
        story: 'Summer the chowchow puppy.',
        imageurl: './assets/images/puppy.jpg'
      },
      {
        title: 'Strawberry',  
        story: 'Strawberry from Strawberry Farm in Benguet.',
        imageurl: './assets/images/fruit.jpg'
      }
    ]
  }
}


class Gallery extends Component{
  render(){
    let gallery = this.props.gallery
    return(
      
          <div className="card">
            <img src={gallery.imageurl} alt=""/>
            <h2>{gallery.title}</h2>
            <p>{gallery.story}</p>
          </div>
     
    )
  }
}

class Filter extends Component{
  render(){
    return(
      <div>
        <input type="text" name="" id="" placeholder="Search" onKeyUp={
            event => this.props.onSearch(event.target.value)}/>
      </div>
    )
  }
}

class App extends Component {

  constructor(){
    super();
    this.state = {
      serverData: {},
      searchData: '',
      responseImages:  [],
      files: [],
      filePreview: ''
    }
  }

  componentDidMount(){
    this.setState({serverData: userData})

    axios.get('/photobook-api/photobook-api.php')
    .then((result)=> {
      this.setState({
        responseImages: result.data
      });
    })
  }

  addImage(event){
    event.preventDefault();
    let title = this.refs.title.value
    let story = this.refs.story.value
    let imageurl = ''
    console.log(this.state.files)
    this.state.files.map(file => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", `codeinfuse, medium, gist`);
      formData.append("upload_preset", "h5b2es9t"); 
      formData.append("api_key", "528924533891767"); 
      formData.append("timestamp", (Date.now() / 1000) | 0);
      
      //upload image to cloudinary
      return axios.post("https://api.cloudinary.com/v1_1/adrianweb/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }).then(response => {
        const data = response.data;
        imageurl = data.url
        axios.post('/photobook-api/photobook-addImage.php', {
          title: title,
          story: story,
          imageurl: imageurl
        })
        .then((result) => {
          this.setState({
            responseImages: result.data,
            files: [],
            filePreview: ''
          });
          this.refs.title.value = ""
          this.refs.story.value = ""
        })
        .catch(function (error) {
          console.log(error);
        });
      })
    });
  }

  onDrop = files => {
    console.log(files)
    this.setState({
      files,
      filePreview: files[0].preview
    });

  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?

        <div>
        <h1>{this.state.serverData.user.name}'s Gallery </h1>  
        <hr/>
        <div><Filter onSearch={text => this.setState({searchData: text})}></Filter></div>
        <form onSubmit={this.addImage.bind(this)}>
          <input type="text" ref="title"/>
          <input type="text" ref="story"/>
          <br/>
          <Dropzone 
            onDrop={this.onDrop}
            multiple 
            accept="image/*" 
          >
            <p>Drop your files or click here to upload</p>
          </Dropzone>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
            {this.state.filePreview ?
                <img src={this.state.filePreview} alt=" "/> : ""
            }
              
          <br/>
          <button type="submit">Add Image</button>
        </form>
        {this.state.responseImages ?
          
          <div className="gallery-wrap">

          {this.state.responseImages.filter(images =>
              images.title.toLowerCase().includes(
                this.state.searchData.toLowerCase())
              ).map(gallery =>
                <Gallery gallery={gallery} />
            )
          }
          </div> : <h3>No Data</h3>
        }
        </div> : <h3>Loading...</h3>
        }
      </div>
    );
  }
}

export default App;
