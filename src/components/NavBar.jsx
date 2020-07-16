import React from 'react';
import { Redirect } from 'react-router-dom'

class NavBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: sessionStorage.getItem('username')
    };
    this.logOut = this.logOut.bind(this)
  };
  logOut(){
    fetch(`http://localhost:9000/index/logout`, {credentials: 'include' })
        .then(res => res.json())
        .then(result=>{
            sessionStorage.setItem('LoginStatus', false)
            console.log(result)
            this.forceUpdate()
        })
  };
  render(){
    if(sessionStorage.getItem('LoginStatus') === 'false'){
        return <Redirect to='/login' />
    }else{
      return(
        <nav className="navbar navbar-light bg-light justify-content-end">
          <div>
            <span className="navbar-text">
              {this.state.username}
            </span>
            <button className="btn btn-danger ml-2 my-2 my-sm-0" type="button" onClick={this.logOut}>Logout</button>
          </div>
        </nav>
      )
    }
  };
}

export default NavBar;
