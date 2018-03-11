import React, { Component } from 'react';
import './App.css';

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
      searchData: ''
    }
  }

  componentDidMount(){
    this.setState({serverData: userData})
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
        <div>
        <h1>{this.state.serverData.user.name}'s Gallery </h1>  
        <hr/>
        <div><Filter onSearch={text => this.setState({searchData: text})}></Filter></div>
        <div className="gallery-wrap">
        {this.state.serverData.user.images.filter(images =>
            images.title.toLowerCase().includes(
              this.state.searchData.toLowerCase())
          ).map(gallery =>
             <Gallery gallery={gallery} />
        )}
        </div>
        </div> : <h3>Loading...</h3>
        }
      </div>
    );
  }
}

export default App;
