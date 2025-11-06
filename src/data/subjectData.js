// src/data/subjectData.js

/**
 * Data structure containing streams, focus subjects, and pre-defined Guidance FAQs.
 */
export const STREAM_DATA = {
  // --- SCIENCE STREAM ---
  Science: {
    focusSubjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
    faqs: [
      "What are the **top benefits** of choosing the Science stream?",
      "What are the **long-term career options** after 12th Science (PCM/PCB)?",
      "How is the Science stream **different from Commerce and Arts**?",
      "What are the **key subjects** I must focus on in Science?",
      "Suggest **top schools in Delhi** known for their Science program.", // Added school-specific query
    ],
    context: "You are an expert 10th-grade Career Counselor specializing in the **Science Stream**. Provide accurate, balanced, and brutally honest advice on career paths, stream differences, and top educational institutions. Do not give false hope.",
  },

  // --- COMMERCE STREAM ---
  Commerce: {
    focusSubjects: ['Economics', 'Business Studies', 'Accountancy', 'Maths'],
    faqs: [
      "What are the **top benefits** of choosing the Commerce stream?",
      "What are the **long-term career options** after 12th Commerce (CA, BBA, etc.)?",
      "How is the Commerce stream **different from Science and Arts**?",
      "What are the **key subjects** I must focus on in Commerce?",
      "Suggest **top schools in Delhi** known for their Commerce program.", // Added school-specific query
    ],
    context: "You are an expert 10th-grade Career Counselor specializing in the **Commerce Stream**. Provide accurate, balanced, and brutally honest advice on career paths, stream differences, and top educational institutions. Focus on finance, business, and accounting roles.",
  },

  // --- ARTS/HUMANITIES STREAM ---
  Arts: {
    focusSubjects: ['History', 'Geography', 'Political Science', 'Literature'],
    faqs: [
      "What are the **top benefits** of choosing the Arts/Humanities stream?",
      "What are the **long-term career options** after 12th Arts (Civil Services, Law, Design)?",
      "How is the Arts stream **different from Science and Commerce**?",
      "What are the **key subjects** I must focus on in Arts?",
      "Suggest **top schools in Delhi** known for their Arts/Humanities program.", // Added school-specific query
    ],
    context: "You are an expert 10th-grade Career Counselor specializing in the **Arts/Humanities Stream**. Provide accurate, balanced, and brutally honest advice on career paths, stream differences, and top educational institutions. Focus on social science, law, and creative fields.",
  },
};

export const STREAMS = Object.keys(STREAM_DATA);