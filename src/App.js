import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './Calendar';
import AddEvent from './AddEvent';
import AIPage from './AiPage';

function App() {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar events={events} />} />
        <Route path="/add" element={<AddEvent onAddEvent={addEvent} />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
    </Router>
  );
}

export default App;
