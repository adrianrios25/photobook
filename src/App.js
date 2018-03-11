import React, { Component } from 'react';
import './App.css';

let userData = {
  user: {
    name: 'Adrian'
  }
}

class App extends Component {

  constructor(){
    super();
    this.state = {
      serverData: {}
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
        <h1>{this.state.serverData.user.name} </h1>  
        </div> : <h3>Loading...</h3>

        }
      </div>

     
    );
  }
}

export default App;
