import React from 'react'

class EventCard extends React.Component{
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
        this.closeEventInfo = this.closeEventInfo.bind(this);
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
        if(this.state.selected === -1){
            //this.state.selected = index;
            this.setState({
                selected: index,
                currentEvent: this.state.data[index],
            });
        }
        console.log(index, this.state.selected, e.target);
    };
    closeEventInfo(){
        this.setState({selected: -1})
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
        this.setState({page: 1})
        event.preventDefault();
        this.getEventList(1);
    };
    render(){
        return(<>
        <div style={{display: this.state.selected === -1 ? 'block' : 'none'}}>
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
                {this.state.data.map((file, index) => (
                    <li className="list-group-item" key={index} onClick={(e) => this.openEventInfo(index, e)}>
                        <div className="card-body">
                            <h5 className="card-title">{file.event_summary}</h5>
                            <p className="card-text">Location: {file.event_location}</p>
                            <p className="card-text small">Date: {file.event_date}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <nav>
                <button className={this.state.page === 1 ? "btn btn-primary disabled" : "btn btn-primary"} disabled={this.state.page === 1} onClick={this.lastPage}>&laquo;</button>
                <button className="btn btn-primary float-right" onClick={this.nextPage}>&raquo;</button>
            </nav>
        </div>
        <div className="card-body" style={{display: this.state.selected === -1 ? 'none' : 'block'}}>
            <h5 className="card-title">{this.state.currentEvent.event_summary}</h5>
            <p className="card-text">Organizer: {this.state.currentEvent.event_org}</p>
            <p className="card-text">Location: {this.state.currentEvent.event_location}</p>
            <p className="card-text small">Date: {this.state.currentEvent.event_date}</p>
            <button className="btn btn-primary float-right" onClick={this.closeEventInfo}>Back</button>
        </div>
        </>)
    };
}


export default EventCard;