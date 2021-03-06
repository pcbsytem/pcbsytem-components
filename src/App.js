import React, { Component } from 'react';
import './App.css';
import Datepicker from './components/datepicker/Datepicker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: {}
    }

    this.handleDate = this.handleDate.bind(this);
  }

  handleDate(date) {
    this.setState({ date });
    console.log(date)
  }

  render() {
    return (
      <div className="App flex position-center">     
        <Datepicker 
          label="Select date" 
          handleDate={this.handleDate} 
          // maxDate={} 
          // minDate={}
        /> 
      </div>
    );
  }
}

export default App;
