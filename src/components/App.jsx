import React from 'react';
import NavBar from './NavBar';
import Main from './Main';
import { Redirect } from 'react-router-dom'

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
    if(sessionStorage.getItem('LoginStatus') === 'true'){
      return (
        <div className="App">
          <Header/>
          <Main userId={1}/>
        </div>
      )
    }else{
      return <Redirect to ='/Login'/>
    }
  }
}

export default App;
