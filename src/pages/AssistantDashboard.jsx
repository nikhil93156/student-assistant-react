// src/pages/AssistantDashboard.jsx
import React, { useState } from 'react';
import Chatbot from '../components/Chatbot';
import FAQList from '../components/FAQList';
import { useStudent } from '../context/StudentContext';
import { Navigate } from 'react-router-dom';

const AssistantDashboard = () => {
  const { isDataSubmitted, studentData } = useStudent();
  const [initialQuestion, setInitialQuestion] = useState(null);

  if (!isDataSubmitted) {
    return <Navigate to="/" replace />;
  }

  const handleFAQClick = (question) => {
    setInitialQuestion(question);
    setTimeout(() => setInitialQuestion(null), 10);
  };
  
  const currentStream = studentData?.stream || 'General';

  return (
   <div className="min-h-screen p-4 sm:p-8 
      bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600 
      text-gray-800" 
    >
      <h1 className="text-4xl font-extrabold text-white mb-2" style={{ textShadow: '2px 2px #00000040' }}>
        10th Grade Career Counselor 🧭
      </h1>
      <p className="text-lg text-white mb-8" style={{ textShadow: '1px 1px #00000040' }}>
        Hello, **{studentData?.name || 'Student'}**! You are viewing guidance for the **{currentStream}** Stream.
      </p>
      <div className="lg:mr-96">
       <FAQList onQuestionClick={handleFAQClick} />
      </div>

      <Chatbot initialQuestion={initialQuestion} />
    </div>
  );
};

export default AssistantDashboard;