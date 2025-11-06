// src/context/StudentContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { STREAM_DATA } from '../data/subjectData';

const StudentContext = createContext();
const STORAGE_KEY = 'studentAssistantData'; // Key for Local Storage

export const useStudent = () => {
  return useContext(StudentContext);
};

// Function to safely get data from Local Storage
const getInitialState = () => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            return {
                studentData: parsedData.studentData,
                isDataSubmitted: true, // If data exists, it was submitted
                activeStreamData: STREAM_DATA[parsedData.studentData.stream],
            };
        }
    } catch (e) {
        console.error("Could not load data from Local Storage:", e);
    }
    // Return default state if nothing is stored or loading fails
    return {
        studentData: null,
        isDataSubmitted: false,
        activeStreamData: null,
    };
};

export const StudentProvider = ({ children }) => {
    // 1. Initialize state using the data loaded from Local Storage
    const initialState = getInitialState();

    const [studentData, setStudentData] = useState(initialState.studentData); 
    const [isDataSubmitted, setIsDataSubmitted] = useState(initialState.isDataSubmitted);
    const [activeStreamData, setActiveStreamData] = useState(initialState.activeStreamData); 

    const updateStudentData = (data) => {
        setStudentData(data);
        setIsDataSubmitted(true);
        const streamData = STREAM_DATA[data.stream];
        setActiveStreamData(streamData);
        
        // 2. SAVE data to Local Storage immediately after submission
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ studentData: data }));
    };

    // If studentData ever changes (e.g., if you add a feature to update the name), save it.
    useEffect(() => {
        if (studentData) {
             localStorage.setItem(STORAGE_KEY, JSON.stringify({ studentData }));
        }
    }, [studentData]);


    return (
      <StudentContext.Provider 
        value={{ 
          studentData, 
          updateStudentData, 
          isDataSubmitted, 
          activeStreamData
        }}
      >
        {children}
      </StudentContext.Provider>
    );
};