import React from 'react';
import { Redirect } from 'react-router-dom';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };
    login(){
        if(this.state.email && this.state.password){
            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.email,
                    password: btoa(this.state.password),
                    }),
                credentials: 'include'
            };
            fetch(`http://localhost:9000/index/login`, requestOptions)
                .then(res => res.json())
                .then(result=>{
                    console.log(result);
                    if(result.msg === "fail"){
                        alert('Incorrect email or pswd!')
                    }else{
                        sessionStorage.setItem('LoginStatus', result.loginStatus);
                        sessionStorage.setItem('userName', result.userName);
                        sessionStorage.setItem('userId', result.userId);
                        sessionStorage.getItem('userId')
                    }
                    this.forceUpdate()
                })
        }else{
            alert('Enter email & pswd!')
        }
    };
    handleChange(event){
        switch (event.target.id) {
            case "email":
                this.setState({
                    email: event.target.value
                });
                break;
            case "password":
                this.setState({
                    password: event.target.value
                })
                break;
            default:
                break;
        }
    };
    render(){
        if(sessionStorage.getItem('LoginStatus') === 'true'){
            return <Redirect to='/event'/>
        }else{
            return (
            <div className="container">
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" className="form-control" placeholder="" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" className="form-control" placeholder="" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.login}>Login</button>
                </form>
            </div>
            )
        }
    }
}

export default Login;
