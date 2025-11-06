// src/pages/InfoForm.jsx (Updated outer div and inner container className)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { STREAMS } from '../data/subjectData';

const InfoForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    stream: STREAMS[0],
    focusSubject: ''
  });
  const { updateStudentData } = useStudent();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.focusSubject || !formData.stream) {
        alert('Please fill out all fields.');
        return;
    }
    updateStudentData(formData); 
    navigate('/assistant');
  };

  return (
    // NEW: Shining multi-color gradient background (Blue, Green, Purple)
    <div className="min-h-screen flex items-center justify-center p-4 
      bg-gradient-to-br from-blue-500 via-green-400 to-purple-500"
    >
      {/* Container is slightly transparent white to let the gradient shimmer through */}
      <div className="max-w-md w-full p-8 space-y-6 bg-white bg-opacity-90 shadow-2xl rounded-lg backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold text-indigo-800 text-center">
          Choose Your Path 🧑‍🎓
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Name Input - All form controls remain the same */}
          <input
            id="name"
            name="name"
            type="text"
            required
            className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Stream Dropdown */}
          <div>
            <label htmlFor="stream" className="block text-sm font-medium text-gray-700">Choose Stream</label>
            <select
              id="stream"
              name="stream"
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={formData.stream}
              onChange={handleChange}
            >
              {STREAMS.map(stream => (
                <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>
          </div>

          {/* Focus Subject Input */}
          <div>
            <label htmlFor="focusSubject" className="block text-sm font-medium text-gray-700">Focus Subject</label>
            <input
              id="focusSubject"
              name="focusSubject"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your main subject (e.g., Physics, Accounts, History)"
              value={formData.focusSubject}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Start Personalized Assistant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InfoForm;