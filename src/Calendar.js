import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Link } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');

  const handlePriorityFilterChange = (e) => {
    setSelectedPriority(e.target.value);
  };

  const filteredEvents = selectedPriority
    ? events.filter((event) => event.priority === selectedPriority)
    : events;

  const updateEvents = () => {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.map((event) => {
      return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      };
    });
    setEvents(events);
  };

  const selectEvent = (event) => {
    const confirmDelete = window.confirm(
      `Event details:\nTitle: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}\nDescription: ${event.description}\n\nDo you want to delete this event?`
    );
    if (confirmDelete) {
      const updatedEvents = events.filter((e) => e !== event);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  useEffect(() => {
    updateEvents();

    window.addEventListener('storage', updateEvents);

    return () => {
      window.removeEventListener('storage', updateEvents);
    };
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <h1 className="welcome-title">Welcome to Calendar AI</h1>
        <p>This is a smart calendar application powered by AI.</p>
        <div className="button-container">
          <Link className="btn btn-primary my-3 button-spacing" to="/add">
            Add Event
          </Link>
          <Link className="btn btn-primary my-3" to="/ai">
            AI Schedule Analyzer
          </Link>
        </div>
        <div className="priority-filter-container">
          <label htmlFor="priorityFilter">Filter by Priority:</label>
          <select
            className="priority-filter-dropdown"
            id="priorityFilter"
            value={selectedPriority}
            onChange={handlePriorityFilterChange}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={['month', 'week', 'day', 'agenda']}
          onSelectEvent={selectEvent}
        />
      </div>
    </div>
  );
}
