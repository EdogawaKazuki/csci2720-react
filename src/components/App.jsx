import React from 'react';
import './NavBar';
import NavBar from './NavBar';
import Main from './Main';

class Header extends React.Component{
  render(){
      return(
        <header className="App-header">
          <NavBar></NavBar>
        </header>
      )
  }
}


class App extends React.Component{
  render(){
    return (
      <div className="App">
        <Header/>
        <Main userId={1}/>
      </div>
    )
  }
}

export default App;
