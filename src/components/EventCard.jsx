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
        };
        this.nextPage = this.nextPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.closeEventInfo = this.closeEventInfo.bind(this);
        this.sort = this.sort.bind(this);
    };
    componentDidMount(){
        this.getEventList(this.state.page, this.state.sortType, this.state.sortMode);
    };
    getEventList(page, sortType, sortMode){
        fetch(`http://localhost:9000/api/events/page/${page}/sortBy/${sortMode}${sortType}`)
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
        this.getEventList(this.state.page - 1, this.state.sortType, this.state.sortMode);
        window.history.pushState({page: this.state.page - 1},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}`);
        this.setState({page: this.state.page - 1});
    };
    nextPage(){
        this.getEventList(this.state.page + 1, this.state.sortType, this.state.sortMode);
        window.history.pushState({page: this.state.page + 1},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${this.state.sortType}`);
        this.setState({page: this.state.page + 1});
    };
    sort(event){
        if(event.target.id === "sortType"){
            this.getEventList(this.state.page, event.target.value, this.state.sortMode);
            this.setState({sortType: event.target.value});
            window.history.pushState({page: this.state.page},'page',`/page/${this.state.page}/sortBy/${this.state.sortMode}${event.target.value}`);
        }
        if(event.target.id === "sortMode"){
            this.getEventList(this.state.page, this.state.sortType, event.target.value);
            this.setState({sortMode: event.target.value});
            window.history.pushState({page: this.state.page},'page',`/page/${this.state.page}/sortBy/${event.target.value}${this.state.sortType}`);
        }
    };
    render(){
        return(<>
        <div style={{display: this.state.selected === -1 ? 'block' : 'none'}}>
            <nav className="navbar navbar-light navbar-expand bg-light">
                <span className="navbar-brand">Sort By</span>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item dropdown">
                        <select className="form-control" onChange={this.sort} value={this.state.sortType} id="sortType">
                            <option value="event_summary">Summary</option>
                            <option value="event_date">Date</option>
                            <option value="event_org">Organizer</option>
                            <option value="event_location">Location</option>
                        </select>
                    </li>
                    <li className="nav-item dropdown">
                        <select className="form-control" onChange={this.sort} value={this.state.sortMode} id="sortMode">
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