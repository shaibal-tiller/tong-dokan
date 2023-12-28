import React, { useState, useEffect } from 'react';

const DatePicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Update form data on date change
  useEffect(() => {
    const newDate = new Date(selectedDate);
    const newISOString = newDate.toISOString();
    onDateChange(newISOString);
  }, [selectedDate, onDateChange]);

  return (
    <div className="flex gap-2 items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
      <div className="w-[200px] overflow-hidden">
        <input
          className="bg-dark-1 outline-none"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  );
};

export default DatePicker;