import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../StudentPagesCss/Student_SchedulePage.css';

function Student_SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}/schedule`);
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      }
    };

    if (userId) {
      fetchSchedule();
    }
  }, [userId]);

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  return (
    <div className="student-schedule-container">
      <h1 className="student-schedule-title">Schedule</h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.subject_name}</td>
              <td>{item.day}</td>
              <td>{formatTime(item.time_start)}</td>
              <td>{formatTime(item.time_end)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Student_SchedulePage;
