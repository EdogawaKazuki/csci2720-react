import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.jsx';
import Login from './components/Login.jsx';
import {Route, BrowserRouter as Router, Redirect} from 'react-router-dom';

sessionStorage.setItem('LoginStatus', false)

class Index extends React.Component{
  render(){
    if(sessionStorage.getItem('LoginStatus') === true){
      return <Redirect to='/event'/>
    }else{
      return <Redirect to='/login' />
    }
  }
}

ReactDOM.render(
  <Router>
      <Route path="/" component={Index}/>
      <Route path="/login" component={Login}/>
      <Route path="/event" component={App}/>
  </Router>,
  document.getElementById('root')
);
