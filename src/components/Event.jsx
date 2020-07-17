import React from 'react'
import { Redirect } from 'react-router-dom'
import APIHost from '../config'


class Event extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            page: 1,
            comment: [],
            currentEvent: this.props.currentEvent,
            showComment: true,
            newComment: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.getCommentList = this.getCommentList.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.addComment = this.addComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.likeEvent = this.likeEvent.bind(this);
    };
    componentDidMount(){
        if(this.props.currentEvent.length){
            this.setState({
                currentEvent: this.props.currentEvent
            });
            this.getCommentList(this.state.page);
        }
    };
    componentDidUpdate(){
        if(this.state.currentEvent !== this.props.currentEvent){
            this.setState({
                currentEvent: this.props.currentEvent,
                page: 1,
            })
            this.getCommentList(1)
        }
    }
    getCommentList(page){
        fetch(`${APIHost}/api/comments/eventId/${this.props.currentEvent.event_id}/page/${page}`, {credentials: 'include'})
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    comment: result,
                    showComment: true,
                });
                console.log(result)
                console.log(sessionStorage.getItem('userId'))
            },
            (error) => {
                console.log(error)
            });
    };
    lastPage(){
        this.getCommentList(this.state.page - 1);
        this.setState({page: this.state.page - 1});
    };
    nextPage(){
        this.getCommentList(this.state.page + 1);
        this.setState({page: this.state.page + 1});
    };
    handleChange(event){
        switch (event.target.id) {
            case "content":
                this.setState({
                    newComment: event.target.value
                });
                break;
            default:
                break;
        }
    };
    addComment(){
        console.log(sessionStorage.getItem('userId'))
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId: this.props.currentEvent.event_id,
                content: this.state.newComment,
                date: new Date(),
                }),
            credentials: 'include'
        };
        //console.log(requestOptions)
        fetch(`${APIHost}/api/comments`, requestOptions)
            .then(res => res.json())
            .then(result => {
                //console.log(result)
                this.setState({newComment: ''})
                this.getCommentList(1);
            });
    };
    deleteComment(commentId){
        console.log(commentId);
        //console.log(requestOptions)
        fetch(`${APIHost}/api/comments/${commentId}`, {method: 'DELETE', credentials: 'include'})
            .then(res => res.json())
            .then(result => {
                //console.log(result)
                this.getCommentList(1);
            });
    };
    likeEvent(){
        let requestOptions={
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({eventId: this.props.currentEvent.event_id}),
            credentials: 'include'
        }
        fetch(`${APIHost}/api/favorite`,requestOptions)
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                alert(result.msg);
            })
    }
    render(){
        if(sessionStorage.getItem('LoginStatus') === 'false'){
            return <Redirect to='/login' />
        }else{
            return(
                <>
                <div className="card-body">
                    <h3 className="card-title">{this.props.currentEvent.event_summary}</h3>
                    <button className="btn btn-danger m-2 float-right" onClick={this.likeEvent}>Like</button>
                    <p className="card-text">Organizer: {this.props.currentEvent.event_org}</p>
                    <p className="card-text">Location: {this.props.currentEvent.event_location}</p>
                    <p className="card-text small">Date: {this.props.currentEvent.event_date}</p>
                    <div>
                        <ul className="list-group my-2">
                            {this.state.comment.map((comment, index) => (
                                <li className="list-group-item" key={index}>
                                    <div className="media">
                                        <div className="media-body">
                                            <p>{comment.content}</p>
                                            <small className="text-muted font-italic">
                                                <p>Name: {comment.userName} Date: {comment.date} {comment.userId === sessionStorage.getItem('userId') - 0 ? <button className="btn btn-sm btn-danger float-right" onClick={this.deleteComment.bind(this, comment.commentId)}>Delete</button> : ''}</p>
                                            </small>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <nav className="container my-2">
                            <button className="btn btn-primary" disabled={this.state.page === 1} onClick={this.lastPage}>&laquo;</button>
                            <button className="btn btn-primary float-right" disabled={this.state.comment.length < 5} onClick={this.nextPage}>&raquo;</button>
                        </nav>
                    </div>
                    <form>
                        <div className="form-group">
                            <label htmlFor="content">Your comment</label>
                            <textarea type="text" name="content" id="content" className="form-control" placeholder="" rows="3" value={this.state.newComment} onChange={this.handleChange}></textarea>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={this.addComment}>Add comment</button>
                    </form>
                </div>
                </>
            )
        }
    }
}

export default Event;