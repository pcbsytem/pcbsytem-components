import React, { Component } from 'react';
import "./datepicker.css";

class DatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedDay: null,
      selectedMonth: null,
      selectedYear: null,
      dayNames: [
        'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
      ],
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      dayList: []
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let { currentMonth, currentYear } = this.state;
    this.getDayList(currentMonth, currentYear);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  cardClose() {
    setTimeout(() =>
      this.setState({
        ...this.state,
        show: false,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear()
      }), 200);
  }

  handleClick(e) {
    let elementClass = e.target.className;
    let checkClass =
      elementClass === 'day' ||
      elementClass === 'change' ||
      elementClass === 'day-name' ||
      elementClass.animVal === '' ||
      elementClass === 'separator' ||
      elementClass.animVal === 'icon' ||
      elementClass === 'input year-input' ||
      elementClass === 'datepicker-input' ||
      elementClass === 'input month-input' ||
      elementClass === 'flex days-container' ||
      elementClass === 'flex date-container' ||
      elementClass === 'datepicker-card show';

    !checkClass ? this.cardClose() : this.setState({ show: true });
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    let operation =
      name === 'currentMonth' ? value.length > 0 && value.length <= 2 : value.length === 4;

    this.setState({ [name]: parseInt(value) });

    setTimeout(function () {
      if (operation) {
        let { currentMonth, currentYear } = this.state;
        this.getDayList(currentMonth, currentYear);
      }
    }.bind(this), 1000);
  }

  objectExample(date) {
    let day = date.getDate();
    let month = new Date(date).getMonth() + 1;
    let year = new Date(date).getFullYear();

    month = month.toString().padStart(2, 0);
    day = day.toString().padStart(2, 0);

    let complete = new Date(date);
    let formated = `${day}/${month}/${year}`;
    let { selectedDay, selectedMonth, selectedYear } = this.state;
    let selected = day === selectedDay && month === selectedMonth && year === selectedYear;

    return {
      complete,
      formated,
      number: day,
      selected
    };
  }

  getDaysInMonth(month, year) {
    let date = new Date(year, month, 1);
    let days = [];

    while (date.getMonth() === month) {
      if (date.getDate() === 1) {
        for (let i = 0; i < date.getDay(); i++) {
          days.push({});
        }
      }

      let dayObject = this.objectExample(date);
      days.push(dayObject);
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  async getDayList(month, year) {
    let dayList = await this.getDaysInMonth(month, year);
    this.setState({ ...this.state, dayList, });
  }

  nextDate() {
    let { currentMonth, currentYear } = this.state;

    if (currentMonth < 11) {
      currentMonth++;
    } else {
      currentYear = currentYear + 1;
      currentMonth = 0;
    }

    this.setState({ ...this.state, currentMonth, currentYear });
    this.getDayList(currentMonth, currentYear);
  }

  previousDate() {
    let { currentMonth, currentYear } = this.state;

    if (currentMonth > 0) {
      currentMonth--;
    } else {
      currentYear = currentYear - 1;
      currentMonth = 11;
    }

    this.setState({ ...this.state, currentMonth, currentYear });
    this.getDayList(currentMonth, currentYear);
  }

  selectDate(date) {
    let { dayList, selectedDay, selectedMonth } = this.state;
    let month = date.complete.getMonth() + 1;
    let verifyDayAndMonth = date.number !== selectedDay && month !== selectedMonth;
    let input = document.getElementById('datepicker');
    input.value = date.formated;

    if (verifyDayAndMonth) {
      this.setState({
        selectedDay: date.number,
        selectedMonth: month.toString().padStart(2, 0),
        selectedYear: date.complete.getFullYear()
      });
    }

    dayList.map(item =>
      item.selected = (date.number === item.number));

    this.props.handleDate(date);
  }

  render() {
    const { currentMonth, currentYear, dayList, dayNames, monthNames, show } = this.state;

    return (
      <div ref={node => this.node = node}>
        <input
          type="text"
          name="datepicker"
          id="datepicker"
          className="datepicker-input"
          autoComplete="off"
          placeholder={this.props.label}
          onClick={this.handleClick}
          onBlur={this.handleBlur} />

        <div
          className={`datepicker-card ${show && 'show'}`}>
          <div className="flex date-container">
            <button type="button" className="change" onClick={() => this.previousDate()}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </button>

            <select
              type="text"
              name="currentMonth"
              id="month-input"
              className="input month-input"
              value={currentMonth}
              onChange={this.handleChange}>
              {
                monthNames.map((item, index) =>
                  <option value={index} key={item}>{item}</option>
                )
              }
            </select>

            <div className="separator"> / </div>

            <input
              type="text"
              name="currentYear"
              id="year-input"
              className="input year-input"
              value={currentYear}
              onChange={this.handleChange} />

            <button type="button" className="change" onClick={() => this.nextDate()}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </button>
          </div>

          <div className="flex day-names-container">
            {
              dayNames.map(item => <div key={item} className="day-name">{item}</div>)
            }
          </div>

          <div className="flex days-container">
            {
              dayList.map((item, index) =>
                <button
                  type="button"
                  key={`${item.complete}${index}`}
                  disabled={!item.complete}
                  className={
                    `${!item.complete ? 'empty' : 'day'} 
                    ${item.selected ? 'selected' : ''}`
                  }
                  onClick={() => this.selectDate(item)}>{item.number}</button>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default DatePicker;