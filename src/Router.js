// src/Router.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './Calendar';
import AddEvent from './AddEvent';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Calendar />} />
                <Route path="/add" element={<AddEvent />} />
            </Routes>
        </Router>
    );
}
