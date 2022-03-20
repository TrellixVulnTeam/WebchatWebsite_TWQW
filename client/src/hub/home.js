import * as React from "react";
import { Navigate } from 'react-router-dom';

class Home extends React.Component {
    constructor(props)  {
      super(props);
      this.state = {
      };
    }
    MouseOver(event) {
      event.target.style.width = '200px';
      event.target.style.color = '#768bac'
    }
    MouseOut(event){
      event.target.style.width = '50px';
      event.target.style.color = 'rgba(0, 0, 0, 0)'
    }

    componentDidMount() {

    }
    render()    {

    return (
      <>
        <head>
        <title>Webchat - Home</title>
        </head>

        <div className="sidebar" onMouseOver={this.MouseOver} onMouseOut={this.MouseOut}>
          <img src="/images/speech-bubble.png" align="left"/> <p>Webchat - Home</p>
        </div>
      </>
    )};
};
export default Home;