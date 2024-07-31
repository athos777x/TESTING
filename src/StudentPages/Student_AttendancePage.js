import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../StudentPagesCss/Student_AttendancePage.css';
import axios from 'axios';

function Student_AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const userId = localStorage.getItem('userId'); // Get the userId from localStorage

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}/attendance`);
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    if (userId) {
      fetchAttendance();
    }
  }, [userId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const attendance = attendanceData.find(
        (entry) => new Date(entry.date).toDateString() === date.toDateString()
      );
      if (attendance) {
        return <p>{attendance.status}</p>;
      }
    }
  };

  return (
    <div className="student-attendance-container">
      <h1 className="student-attendance-title">Attendance</h1>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={renderTileContent}
      />
      <div className="attendance-details">
        <h2>Details for {selectedDate.toDateString()}</h2>
        {attendanceData
          .filter((entry) => new Date(entry.date).toDateString() === selectedDate.toDateString())
          .map((entry, index) => (
            <div key={index}>
              <p>Status: {entry.status}</p>
              <p>Remarks: {entry.remarks}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Student_AttendancePage;
