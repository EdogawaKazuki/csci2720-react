import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.jsx';
import Login from './components/Login.jsx';
import {Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import event from './event.png'
import comment from './comment.png'
import user from './user.png'


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
class About extends React.Component{
  render(){ 
    return (
      <div>
        name: ZHAO Xinyan<br/>
        <br/>
        I have read http://www.cuhk.edu.hk/policy/academichonesty/<br/>
        <br/>
        how to: <br/>
          cd to csci2720-react<br/> 
          npm run start<br/>
          cd to csci2720-express<br/>
          npm run start<br/>
          <br/>
        schema: <br/>
        <img src={event} alt="event" style={{height: '500px'}}></img>
        <img src={comment} alt="comment" style={{height: '500px'}}></img>
        <img src={user} alt="user" style={{height: '500px'}}></img>
        <br/>

        
      </div>
    )
  }
}

ReactDOM.render(
  <Router>
      <Route path="/login" component={Login}/>
      <Route path="/event" component={App}/>
      <Route path="/about" component={About}/>
  </Router>,
  document.getElementById('root')
);
