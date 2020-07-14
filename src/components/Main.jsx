import React from 'react'
import Event from './Event'

class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selected: -1,
            data: [],
            currentEvent: {},
            page: 1,
            sortType: 'event_summary',
            sortMode: '',
            searchQuery: '',
            searchField: 'event_summary',
        };
        this.handleChange = this.handleChange.bind(this);
        this.getEventList = this.getEventList.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.lastEvent = this.lastEvent.bind(this);
        this.closeEventInfo = this.closeEventInfo.bind(this);
        this.nextEvent = this.nextEvent.bind(this);
    };
    componentDidMount(){
        this.getEventList(this.state.page, this.state.sortType, this.state.sortMode);
    };
    getEventList(page=this.state.page, sortType=this.state.sortType, sortMode=this.state.sortMode, searchField=this.state.searchField, searchQuery=this.state.searchQuery){
        console.log({
            page: page,
            sortType: sortType,
            sortMode: sortMode,
            searchField: searchField,
            searchQuery: searchQuery,
        })
        fetch(`http://localhost:9000/api/events/page/${page}/sortBy/${sortMode}${sortType}/keyword/${searchField}::${searchQuery}`)
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                this.setState({
                    data: result,
                });
            },
            (error) => {
                console.log(error)
            });
        window.scrollTo(0, 0)
    };
    openEventInfo(index, e){
        if(index !== -1){
            //this.state.selected = index;
            this.setState({
                selected: index,
                currentEvent: this.state.data[index],
            });
            window.history.pushState({page: this.state.page - 1},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}/${index}`);
        }else{
            this.setState({selected: -1})
            window.history.pushState({page: this.state.page - 1},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}`);
        }
        console.log(index, this.state.selected, e.target);
    };
    lastEvent(){
        this.openEventInfo(this.state.selected - 1, {})
    };
    closeEventInfo(){
        this.openEventInfo(-1, {})
    };
    nextEvent(){
        this.openEventInfo(this.state.selected + 1, {})
    };
    lastPage(){
        this.getEventList(this.state.page - 1);
        window.history.pushState({page: this.state.page - 1},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}`);
        this.setState({page: this.state.page - 1});
    };
    nextPage(){
        this.getEventList(this.state.page + 1);
        window.history.pushState({page: this.state.page + 1},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}`);
        this.setState({page: this.state.page + 1});
    };
    handleChange(event){
        switch (event.target.id) {
            case "sortType":
                this.getEventList(this.state.page, event.target.value, this.state.sortMode);
                this.setState({sortType: event.target.value});
                window.history.pushState({page: this.state.page},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${event.target.value}`);        
                break;
            case "sortMode":
                this.getEventList(this.state.page, this.state.sortType, event.target.value);
                this.setState({sortMode: event.target.value});
                window.history.pushState({page: this.state.page},'page',`/page/${this.state.page}/sortBy/${event.target.value}${this.state.sortType}`);
                break;
            case "searchField":
                this.setState({searchField: event.target.value});
                break;
            case "searchQuery":
                this.setState({searchQuery: event.target.value});
                break;
            default:
                break;
        }
    };
    doSearch(event){
        this.setState({
            page: 1,
            selected: -1,
        });
        event.preventDefault();
        this.getEventList(1);
    };
    render(){
        return(
        <div>
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
            <div style={{display: this.state.selected === -1 ? 'block' : 'none'}}>
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
                </nav>              
                <ul className="list-group my-2">
                    {this.state.data.map((event, index) => (
                        <li className="list-group-item" key={index} onClick={(e) => this.openEventInfo(index, e)}>
                            <div className="card-body">
                                <h5 className="card-title">{event.event_summary}</h5>
                                <p className="card-text">Organizer: {event.event_org}</p>
                                <p className="card-text">Location: {event.event_location}</p>
                                <p className="card-text small">Date: {event.event_date}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <nav className="container my-2">
                    <button className="btn btn-primary" disabled={this.state.page === 1} onClick={this.lastPage}>&laquo;</button>
                    <button className="btn btn-primary float-right" disabled={this.state.data.length < 10} onClick={this.nextPage}>&raquo;</button>
                </nav>
            </div>
            <div style={{display: this.state.selected === -1 ? 'none' : 'block', height: '100vh'}} >
                <div className="row h-100 bg-secondary">
                    <div className="col-2 align-self-center text-center">
                        <button className="btn" disabled={this.state.selected === 0} onClick={this.lastEvent}>
                            <svg width="100%" height="100%" viewBox="0 0 24 24">
                                <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"></path>
                            </svg>
                        </button>
                        <button className="btn" onClick={this.closeEventInfo}>
                            <svg width="100%" height="100%" viewBox="0 0 24 24">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                            </svg>
                        </button>
                        <button className="btn" disabled={this.state.selected === 9} onClick={this.nextEvent}>
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
        </div>)
    };
}


export default Main;