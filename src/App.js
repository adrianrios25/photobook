import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

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
      file: null
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
    let imageurl = this.refs.photo.files[0].name

    axios.post('/photobook-api/photobook-addImage.php', {
      title: title,
      story: story,
      imageurl: imageurl
    })
    .then((result) => {
      this.setState({
        responseImages: result.data
      });
      console.log(result)
    })
    .catch(function (error) {
      console.log(error);
    });

    this.refs.title.value = ""
    this.refs.story.value = ""
  }

  selectImg(e){
    this.setState({
        file: e.target.files[0]
    })
    console.log(e.target.files[0])
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
          <input type="file" ref="photo" name="photo" onChange={this.selectImg.bind(this)} />
          <button type="submit">Add Image</button>
        </form>
        <div className="gallery-wrap">
        {this.state.responseImages.filter(images =>
            images.title.toLowerCase().includes(
              this.state.searchData.toLowerCase())
            ).map(gallery =>
              <Gallery gallery={gallery} />
          )
        }
        </div>
        </div> : <h3>Loading...</h3>
        }
      </div>
    );
  }
}

export default App;
