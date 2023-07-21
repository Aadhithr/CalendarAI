import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function formatTime(time) {
  return moment(time).format('LLL'); // Format the time as "Month DD, YYYY h:mm A"
}

function TaskList({ tasks }) {
  return (
    <div className="panel task-panel">
      <h3>Tasks for the Next {tasks.length} Days:</h3>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <strong>Task: </strong>
            {task.name}, <strong>Priority: </strong>
            {task.priority}, <strong>Start Time: </strong>
            {formatTime(task.start)}, <strong>End Time: </strong>
            {formatTime(task.end)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AIPage() {
  const navigate = useNavigate();
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [duration, setDuration] = useState(0);
  const [withinDays, setWithinDays] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset the previous response and tasks
    setResponse('');
    setTasks([]);

    const startDate = moment();
    const endDate = moment().add(withinDays, 'days');

    // Fetch the events data from the localStorage and filter out the ones within the requested duration
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const filteredTasks = events.filter((event) =>
      moment(event.start).isBetween(startDate, endDate, null, '[]')
    );

    setTasks(
      filteredTasks.map((event) => ({
        name: event.title,
        priority: event.priority, // Assuming you have a "priority" property in the event object
        start: event.start,
        end: event.end,
      }))
    );

    const formattedTasks = filteredTasks.map(
      (task) =>
        `Task: ${task.title}, Priority: ${task.priority}, Start Time: ${formatTime(
          task.start
        )}, End Time: ${formatTime(task.end)}`
    );

    // Convert the user-selected date and time to a moment object
    const selectedDateTime = moment(dateTime);

    // Format the date and time as a user-friendly string
    const formattedDateTime = selectedDateTime.format('LLL');

    const prompt = `I want to do ${input} which will take around ${duration} hours in the next ${duration} days. Here are my events for the next ${withinDays} days which I will be busy for:\n${formattedTasks.join(
      '\n'
    )}\nPlease tell me when I should do this event so it does not merge with my events that I am doing right now. If possible can I do it on my \nPreferred Date and Time: ${formattedDateTime}`;

    // Create a WebSocket connection
    const ws = new WebSocket(
      `wss://backend.buildpicoapps.com/ask_ai_streaming?app_id=tough-natural&prompt=${encodeURIComponent(
        prompt
      )}`
    );

    // Event listener for WebSocket messages
    ws.addEventListener('message', (event) => {
      setResponse((prevResponse) => prevResponse + event.data); // Append the new message to the existing response
    });

    // Event listener for WebSocket errors
    ws.addEventListener('error', (error) => {
      console.log('WebSocket error', error);
      alert('Oops, we ran into an error. Refresh the page and try again.');
    });

    // Event listener for WebSocket close
    ws.addEventListener('close', (event) => {
      console.log('Connection closed', event.code, event.reason);
      if (event.code !== 1000) {
        alert('Oops, we ran into an error. Refresh the page and try again.');
      }
    });
  };

  const handleBackButtonClick = () => {
    navigate('/'); // Navigate to the home page when the button is clicked
  };

  return (
    <div className="container">
      <h2>AI Page</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Request:
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I want to do..."
            required
          />
        </label>
        <label>
          Duration (in hours):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="0"
            required
          />
        </label>
        <label>
          Within (in days):
          <input
            type="number"
            value={withinDays}
            onChange={(e) => setWithinDays(e.target.value)}
            min="0"
            required
          />
        </label>
        <label>
          Preferred Date and Time:
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <button type="button" className="back-btn" onClick={handleBackButtonClick}>
        <span className="back-btn-icon">🏠</span> Back to Home
      </button>

      <div className="ai-response-panel">
        {response && (
          <div className="panel">
            <h3>AI Generated Text:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>

      <div className="task-panel">
        {tasks.length > 0 && <TaskList tasks={tasks} />}
      </div>
    </div>
  );
}

export default AIPage;
