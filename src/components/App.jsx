import React from 'react';
import './NavBar';
import NavBar from './NavBar';
import EventCard from './EventCard';

class Header extends React.Component{
  render(){
      return(
        <header className="App-header">
          <NavBar></NavBar>
        </header>
      )
  }
}

class Main extends React.Component{
  render(){
      return(
          <main className="container">
            <EventCard />
          </main>
      )
  }
}

class App extends React.Component{
  render(){
    return (
      <div className="App">
        <Header/>
        <Main />
      </div>
    )
  }
}

export default App;
