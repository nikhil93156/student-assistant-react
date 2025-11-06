// src/components/FAQList.jsx
import React from 'react';
import { useStudent } from '../context/StudentContext';

const FAQList = ({ onQuestionClick }) => {
  const { activeStreamData } = useStudent();
  
  if (!activeStreamData) {
    return <div className="p-4 text-center text-red-500">Error: Stream data not loaded.</div>;
  }

  const { faqs } = activeStreamData;
  const streamName = activeStreamData.context.split(' ')[5] || 'General'; // Brute-force extract stream name

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">
        Frequent Questions - **{streamName}** Stream
      </h3>
      <div className="space-y-3">
        {faqs.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-indigo-100 border border-gray-200 rounded-lg text-gray-800 transition duration-150 text-sm"
          >
            ➡️ {question}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500 italic">These questions are tailored to your chosen stream.</p>
    </div>
  );
};

export default FAQList;