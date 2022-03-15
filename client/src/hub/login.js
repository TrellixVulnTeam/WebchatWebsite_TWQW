import React from 'react';
import "../core/styles/login.css"
import { BrowserRouter, Routes, Route, link, Navigate, Link } from 'react-router-dom';


class App extends React.Component {
  constructor(props)  {                                                     // Init our constructor and variables.
    super(props);
    this.state = {
      APIResponce: '',
      username: '',
      password: ''
    };
    this.Authenticate = this.Authenticate.bind(this);                       // So we are able to call this from render()'s html.
    this.Register = this.Register.bind(this); 
    this.Periodic = this.Periodic.bind(this); 
    }

    Register(event) {                                                       // Todo: add a register function to the API
      event.preventDefault();
    }

    async Authenticate(event)  {
      event.preventDefault();                                               // So we don't refresh page on function call.
      let dataPOST =  {
        username: this.state.username,
        password: this.state.password
      };
      if(this.state.username != '' && this.state.password != 0)  {
        const response = await fetch('http://localhost:3000/api/v1/login', {
          method: 'POST',
          body: JSON.stringify(dataPOST),
          headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())                                           // Parse responce as JSON.
        .then((data) => this.setState({APIResponce: data.success}))          // Set APIResponce to data.TYPE <-- responce of the api/v1/login function.
        .catch((error) => this.setState({APIResponce: 'Failed to recive responce.'}));  // If failed return an error.
      }
      else
        this.setState({APIResponce: 'Please enter a username/password'});    // If failed return an error.
  }

  Periodic()  {                                                    // This is periodicly run.
      
  }
  
  render() {
    if(this.state.APIResponce == "true")  {
      return <Navigate to='/hub/home' />
    }

    return (
      <>
      <div class="login-box">
      <br/> <h1 type="title">Login</h1> <br/>
      <form acceptCharset="UTF-8" onSubmit={this.Periodic}>
        <img src="/images/user.png" width={100} height={100} />
        <input
          type="username"
          placeholder="Username"
          maxLength="24"
          name ="username"
          value={this.state.username}
          onChange={(e) => this.setState({ username: e.target.value })}
          required
          />
        <input
          type="password"
          placeholder="Password"
          maxLength="24"
          name ="password"
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
          required
        />
        <div>
          <button id="button1" onClick={this.Authenticate}>Login</button>
          <button id="button1" onClick={this.Register}>Register</button>
        </div>
        </form>
      </div>
      </>
    );
  }
}

export default App;