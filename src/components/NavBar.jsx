import React from 'react';

class NavBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {searchQuery: '', username: 'xyzhao'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  handleChange(event){
    this.setState({searchQuery: event.target.value});
  };
  handleSubmit(event){
    fetch(`http://localhost:9000/api/search/${this.state.searchQuery}`)
    .then(res => res.json())
    .then((result) => {
      console.log(result)
    },
    (error) => {
      console.log(error)
    });
    event.preventDefault();
  };
  logOut(){
    console.log('Log Out')
  };
  render(){
    return(
      <nav className="navbar navbar-light bg-light">
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <input className="form-control mr-sm-2" type="text" placeholder="Search" value={this.state.searchQuery} onChange={this.handleChange} />
          <input className="btn btn-outline-success my-2 my-sm-0" type="submit" value="Search" />
        </form>
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
