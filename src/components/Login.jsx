import React from 'react';
import { Redirect } from 'react-router-dom'

class Login extends React.Component{
    constructor(props){
        super(props);
        this.login = this.login.bind(this);
        sessionStorage.setItem('LoginStatus', false)
    }
    login(){
        fetch(`http://localhost:9000/index/login`, {method:"POST", credentials: 'include' })
            .then(res => res.json())
            .then(result=>{
                sessionStorage.setItem('LoginStatus', result.loginStatus)
                console.log(result);
                this.forceUpdate()
            })
        
    }
    render(){
        if(sessionStorage.getItem('LoginStatus') === 'true'){
            return <Redirect to='/event'/>
        }else{
            return (
            <div className="App">
                Login page
                <button className="btn btn-primary" onClick={this.login}>Log in</button>
            </div>
            )
        }
    }
}

export default Login;
