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
          <div className="col l4 m4 s12">
            <div className="card">
              <div className="card-image waves-effect waves-block waves-light">
                <img src={gallery.imageurl} alt=""/>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">{gallery.title} <i className="material-icons right">more_vert</i></span>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{gallery.title}<i className="material-icons right">close</i></span>
                <p>{gallery.story}</p>
              </div>
            </div>
          </div>
    )
  }
}

class Filter extends Component{
  render(){
    return(
      <div>
         <div className="row">
           <div className="input-field col s12">
            <i className="material-icons prefix">search</i>
             <input id="icon_prefix" type="text" className="validate" onKeyUp={
            event => this.props.onSearch(event.target.value)}/>
             <label for="icon_prefix">Search</label>
        </div>
        </div>
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
        <div className="row">
          <div className="col s12 m3">
            <div className="card-panel">
              <h4>Add New Image </h4>  
              <hr/>
              <div className="row">
                <form className="col s12" onSubmit={this.addImage.bind(this)}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input id="icon_prefix" type="text" className="validate" ref="title" />
                      <label for="icon_prefix">Title</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="icon_telephone" type="tel" className="validate" ref="story" />
                      <label for="icon_telephone">Story</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                    <Dropzone 
                      className="dropzone"
                      onDrop={this.onDrop}
                      multiple 
                      accept="image/*" 
                    >
                      <p className="center-align">Drop your Image or click here to upload</p>
                    </Dropzone>
                    
                    <ul>
                      {
                        this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                      }
                    </ul>
                    </div>
                  </div>
                    {this.state.filePreview ?
                    <div className="row">
                      <div className="col l4 m4 s12 offset-l4 offset-m4 center-align">
                        <img src={this.state.filePreview} alt="" className="responsive-img"/> 
                      </div>
                    </div> : ""
                    }
                    <button className="btn btn-green" type="submit">Submit</button>
                  
                </form>
              </div>
              
            </div>
          </div>
          <div className="col s12 m9">
            <div className="card-panel">
              <h1>{this.state.serverData.user.name}'s Gallery </h1>  
              <hr/>
              <div className="row">
                <Filter onSearch={text => this.setState({searchData: text})}></Filter>
              </div>
              {this.state.responseImages ?
                
                <div className="row">
                {this.state.responseImages.filter(images =>
                    images.title.toLowerCase().includes(
                      this.state.searchData.toLowerCase())
                    ).map(gallery =>
                      <Gallery gallery={gallery} />
                  )
                }
                </div> 

                : <h3>No Data</h3>
              }
            </div>
          </div>
        </div>
        </div> : <h3>Loading...</h3>
        }
      </div>
    );
  }
}

export default App;
