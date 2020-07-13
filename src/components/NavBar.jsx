import React from 'react';

class NavBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {searchQuery: '', username: 'xyzhao'};
  };
  logOut(){
    console.log('Log Out')
  };
  render(){
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
  };
}

export default NavBar;
