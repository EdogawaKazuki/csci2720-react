import React from 'react'
import Event from './Event'
import { withRouter, Redirect } from 'react-router-dom'
import APIHost from '../config'

class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selected: 0,
            favorite: 0,
            data: [],
            list:[],
            currentEvent: {},
            page: 1,
            sortType: 'event_summary',
            sortMode: '',
            searchQuery: '',
            searchField: 'event_summary',
            focusEdit: false,
            flushing: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.getEventList = this.getEventList.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.lastEvent = this.lastEvent.bind(this);
        this.closeEventInfo = this.closeEventInfo.bind(this);
        this.nextEvent = this.nextEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.submitEvent = this.submitEvent.bind(this);
        this.flushData = this.flushData.bind(this);
        this.showFavorite = this.showFavorite.bind(this);
    };
    parse(url){
        let params = url.split('/');
        return {
            page: params[3] - 0 || 1,
            sortMode: params[5] ? (params[5][0] === '-' ? '-' : '') : '',
            sortType: params[5] ? (params[5][0] === '-' ? params[5].slice(1) : params[5]) : 'event_summary',
            searchField: params[7] ? params[7].split('::')[0] : 'event_summary',
            searchQuery: params[7] ? (params[7].split('::')[1] || '') : '',
            selected: params[8] - 0 || 0,
        }
    };
    async componentDidMount(){
        let state = this.parse(this.props.history.location.pathname)
        console.log(state)
        this.setState(state)
        await this.getEventList(state.page, state.sortType, state.sortMode, state.searchField, state.searchQuery);
        this.openEventInfo(state.selected)
    };
    async componentDidUpdate(){
        let state = this.parse(this.props.history.location.pathname)
        if(state.page !== this.state.page ||
            state.sortType !== this.state.sortType ||
            state.sortMode !== this.state.sortMode ||
            state.searchQuery !== this.state.searchQuery ||
            state.searchField !== this.state.searchField){
            console.log(state, this.state)
            await this.getEventList(state.page, state.sortType, state.sortMode, state.searchField, state.searchQuery)
        }
        if(state.selected !== this.state.selected){
            this.openEventInfo(state.selected)
        }
    }
    async getEventList(page=this.state.page, sortType=this.state.sortType, sortMode=this.state.sortMode, searchField=this.state.searchField, searchQuery=this.state.searchQuery){
        console.log('alist')
        let path = `/event/page/${page}/sortBy/${sortMode}${sortType}/keyword/${searchField}::${searchQuery}`;
        if(this.props.history.location.pathname !== path){
            this.props.history.location.pathname = path;
            window.history.pushState({},'state', path);
        }
        window.scrollTo(0, 0)
        await fetch(`${APIHost}/api/events/page/${page}/sortBy/${sortMode}${sortType}/keyword/${searchField}::${searchQuery}`, {credentials: 'include'})
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                if(result.err){
                    sessionStorage.setItem('LoginStatus', false);
                    this.forceUpdate();
                }
                this.setState({
                    page: page,
                    sortType: sortType,
                    sortMode: sortMode,
                    data: result,
                    searchField: searchField,
                    searchQuery: searchQuery
                });
            },
            (error) => {
                console.log(error)
            });
    };
    openEventInfo(index, e){
        if(index !== 0 ){
            console.log('event')
            let path = `/event/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}/keyword/${this.state.searchField}::${this.state.searchQuery}/${index}`;
            if(this.props.history.location.pathname !== path){
                this.props.history.location.pathname = path;
                window.history.pushState({},'state', path);
            }
            this.setState({
                selected: index,
                currentEvent: this.state.data[index - 1],
            });
        }else{
            this.setState({
                selected: 0,
                currentEvent: {
                    event_summary: '',
                    event_org: '',
                    event_date: '',
                    event_location: '',
                    event_id: -1,
                }
            })
            let path = `/event/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}/keyword/${this.state.searchField}::${this.state.searchQuery}`;
            this.props.history.location.pathname = path;
            window.history.pushState({},'state',path);
        }
    };
    lastEvent(){
        this.openEventInfo(this.state.selected - 1, {})
    };
    closeEventInfo(){
        this.openEventInfo(0, {})
    };
    nextEvent(){
        this.openEventInfo(this.state.selected + 1, {})
    };
    lastPage(){
        this.getEventList(this.state.page - 1)
    };
    nextPage(){
        this.getEventList(this.state.page + 1)
    };
    handleChange(event){
        switch (event.target.id) {
            case "sortType":
                this.getEventList(1, event.target.value)
                break;
            case "sortMode":
                this.getEventList(1, this.state.sortType, event.target.value)
                break;
            case "searchField":
                this.getEventList(1, this.state.sortType, this.state.sortMode, event.target.value)
                //this.setState({searchField: event.target.value});
                break;
            case "searchQuery":
                this.getEventList(1, this.state.sortType, this.state.sortMode, this.state.searchField, event.target.value)
                //this.setState({searchQuery: event.target.value});
                break;
            case "summary":
                this.setState({
                    currentEvent: {
                        event_summary: event.target.value,
                        event_org: this.state.currentEvent.event_org,
                        event_date: this.state.currentEvent.event_date,
                        event_location: this.state.currentEvent.event_location,
                        event_id: this.state.currentEvent.event_id,
                    }
                });
                break;
            case "date":
                this.setState({
                    currentEvent: {
                        event_summary: this.state.currentEvent.event_summary,
                        event_org: this.state.currentEvent.event_org,
                        event_date: event.target.value,
                        event_location: this.state.currentEvent.event_location,
                        event_id: this.state.currentEvent.event_id,
                    }
                });
                break;
            case "org":
                this.setState({
                    currentEvent: {
                        event_summary: this.state.currentEvent.event_summary,
                        event_org: event.target.value,
                        event_date: this.state.currentEvent.event_date,
                        event_location: this.state.currentEvent.event_location,
                        event_id: this.state.currentEvent.event_id,
                    }
                });
                break;
            case "loc":
                this.setState({
                    currentEvent: {
                        event_summary: this.state.currentEvent.event_summary,
                        event_org: this.state.currentEvent.event_org,
                        event_date: this.state.currentEvent.event_date,
                        event_location: event.target.value,
                        event_id: this.state.currentEvent.event_id,
                    }
                });
                break;
            default:
                break;
        }
    };
    doSearch(event){
        event.preventDefault();
        this.getEventList(1);
        this.closeEventInfo();
    };
    deleteEvent(index, e){
        let currentEvent = this.state.data[index]
        let eventId = currentEvent.event_id;
        console.log(eventId);
        //console.log(requestOptions)
        fetch(`${APIHost}/api/event/${eventId}`, {method: 'DELETE', credentials: 'include' })
            .then(res => res.json())
            .then(result => {
                //console.log(result)
                this.getEventList(1);
            });
    };
    openEditForm(index, e){
        if(typeof index == 'number'){
            this.setState({currentEvent: this.state.data[index]})
            this.setState({focusEdit: 'Edit'})
        }else{
            this.setState({
                currentEvent: {
                    event_summary: '',
                    event_org: '',
                    event_date: '',
                    event_location: '',
                    event_id: -1,
                }
            })
            this.setState({focusEdit: 'New'})
        }
    };
    submitEvent(){
        let method = '';
        if(this.state.focusEdit === 'New'){
            method = 'POST';
        }else if(this.state.focusEdit === 'Edit'){
            method = 'PUT'
        }
        let requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.currentEvent),
            credentials: 'include' 
        };
        console.log(requestOptions)
        fetch(`${APIHost}/api/event`, requestOptions)
            .then(res => res.json())
            .then(result => {
                //console.log(result)
                this.getEventList(1);
            });
    };
    async flushData(){
        this.setState({flushing: true})
        await fetch(`${APIHost}/api/event`, {credentials: 'include' })
            .then(res => res.json())
            .then(result => {
                //console.log(result)
        });
        await this.getEventList(1);
        this.setState({flushing: false})
    };
    showFavorite(){
        console.log("show favorite");
        fetch(`${APIHost}/api/favorite`,{credentials: 'include'})
            .then(res=>res.json())
            .then(result=>{
                console.log(result);
                this.setState({
                    favorite: 1,
                    list: result
                });
            }
        )
    };

    deleteFavorite(index){
        console.log("delete favorite");
        let currentEvent = this.state.list[index]
        let eventId = currentEvent.event_id;
        console.log(eventId);
        //console.log(requestOptions)
        fetch(`${APIHost}/api/favorite/eventId/${eventId}`, {method: 'DELETE', credentials: 'include' })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                this.showFavorite();
            });
    }
    closeFavorite(){
        console.log("close favorite");
        this.setState({
            favorite:0,
            list:[]
        })
    }

    render(){
        if(sessionStorage.getItem('LoginStatus') === 'false'){
            return <Redirect to='/login' />
        }else{
            return(
                <div>
                    <button className="btn btn-info ml-2 my-2 my-sm-0" type="button" onClick={this.showFavorite}>My Favorites</button>
                    <nav className="navbar navbar-light navbar-expand bg-light">
                        <form className="form-inline input-group mr-2" onSubmit={this.doSearch}>
                            <div className="input-group-prepend mr-2">
                                <select id="searchField" className="form-control" onChange={this.handleChange} value={this.state.searchField}>
                                    <option value="event_summary">Summary</option>
                                    <option value="event_date">Date</option>
                                    <option value="event_org">Organizer</option>
                                    <option value="event_location">Location</option>
                                </select>
                            </div>
                            <input id="searchQuery" className="form-control rounded-left" type="text" placeholder="Search" value={this.state.searchQuery} onChange={this.handleChange} />
                            <div className="input-group-append">
                                <button className="btn btn-outline-success" type="button" onClick={this.doSearch}>Search</button>
                            </div>
                        </form>
                    </nav>
                    <div style={{display: (this.state.selected === 0 && this.state.favorite === 0) ? 'block' : 'none'}}>
                        <nav className="navbar navbar-light navbar-expand bg-light justify-content-end">
                            <span className="small mr-2">Sort By</span>
                            <ul className="navbar-nav mr-2">
                                <li className="nav-item mr-2">
                                    <select id="sortType" className="form-control-sm" onChange={this.handleChange} value={this.state.sortType}>
                                        <option value="event_summary">Summary</option>
                                        <option value="event_date">Date</option>
                                        <option value="event_org">Organizer</option>
                                        <option value="event_location">Location</option>
                                    </select>
                                </li>
                                <li className="nav-item">
                                    <select id="sortMode" className="form-control-sm" onChange={this.handleChange} value={this.state.sortMode}>
                                        <option value="-">Dsc</option>
                                        <option value="">Asc</option>
                                    </select>
                                </li>
                            </ul>
                            <button className="btn btn-primary mr-2" onClick={this.openEditForm} data-toggle="modal" data-target="#openEditFormForm">New Event</button>
                            <button className="btn btn-success" onClick={this.flushData} disabled={this.state.flushing}>{this.state.flushing? <span className="spinner-border spinner-border-sm"></span> : ''} Flush Data</button>
                        </nav>              
                        <ul className="list-group my-2">
                            {this.state.data.map((event, index) => (
                                <li className="list-group-item" key={index} id={index}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-10">
                                                <button className="btn btn-lg btn-outline-dark" onClick={(e) => this.openEventInfo(index + 1, e)}>{event.event_summary}</button>
                                                <p className="card-text">Organizer: {event.event_org}</p>
                                                <p className="card-text">Location: {event.event_location}</p>
                                                <p className="card-text small">Date: {event.event_date}</p>
                                            </div>
                                            <div className="col-2">
                                                <button className="btn btn-info m-2" onClick={(e) => this.openEditForm(index, e)} data-toggle="modal" data-target="#openEditFormForm">Edit</button>
                                                <br/>
                                                <button className="btn btn-danger m-2" onClick={(e) => this.deleteEvent(index, e)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <nav className="container my-2">
                            <button className="btn btn-primary" disabled={this.state.page === 1} onClick={this.lastPage}>&laquo;</button>
                            <button className="btn btn-primary float-right" disabled={this.state.data.length < 10} onClick={this.nextPage}>&raquo;</button>
                        </nav>
                    </div>
                    <div style={{display: this.state.selected > 0 ? 'block' : 'none', height: '100vh'}} >
                        <div className="row h-100 bg-secondary">
                            <div className="col-2 align-self-center text-center">
                                <button className="btn" disabled={this.state.selected === 1} onClick={this.lastEvent}>
                                    <svg width="100%" height="100%" viewBox="0 0 24 24">
                                        <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"></path>
                                    </svg>
                                </button>
                                <button className="btn" onClick={this.closeEventInfo}>
                                    <svg width="100%" height="100%" viewBox="0 0 24 24">
                                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                                    </svg>
                                </button>
                                <button className="btn" disabled={this.state.selected === 10} onClick={this.nextEvent}>
                                    <svg width="100%" height="100%" viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="col-10 bg-light">
                                <Event currentEvent={this.state.currentEvent} userId={this.props.userId}></Event>
                            </div>
                        </div>
                    </div>
                    <div style = {{display: this.state.favorite > 0 ? 'block' : 'none'}}>
                        <ul className="list-group my-2">
                            {this.state.list.map((event, index) => (
                                <li className="list-group-item" key={index} id={index}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-10">
                                                <button className="btn btn-lg btn-outline-dark" onClick={(e) => this.openEventInfo(index + 1, e)}>{event.event_summary}</button>
                                                <p className="card-text">Organizer: {event.event_org}</p>
                                                <p className="card-text">Location: {event.event_location}</p>
                                                <p className="card-text small">Date: {event.event_date}</p>
                                            </div>
                                            <div className="col-2">
                                                <br/>
                                                <button className="btn btn-danger m-2" onClick={(e) => this.deleteFavorite(index)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-info m-2" onClick={(e) => this.closeFavorite()}>Back</button>
                    </div>
                    <div className="modal fade" role="dialog" id="openEditFormForm">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{`${this.state.focusEdit} Event`}</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="summary">Summary</label>
                                            <textarea type="text" name="summary" id="summary" className="form-control" placeholder="Summary" rows="2" value={this.state.currentEvent.event_summary} onChange={this.handleChange}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="org">Organizer</label>
                                            <textarea type="text" name="org" id="org" className="form-control" placeholder="Organizer" rows="2" value={this.state.currentEvent.event_org} onChange={this.handleChange}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="date">Date</label>
                                            <textarea type="text" name="date" id="date" className="form-control" placeholder="15 July 2020" rows="2" value={this.state.currentEvent.event_date} onChange={this.handleChange}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="loc">Location</label>
                                            <textarea type="text" name="loc" id="loc" className="form-control" placeholder="Location" rows="2" value={this.state.currentEvent.event_location} onChange={this.handleChange}></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={this.submitEvent} data-dismiss="modal">Save changes</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            };
        }
}


export default withRouter(Main);