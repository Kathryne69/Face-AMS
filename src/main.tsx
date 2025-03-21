import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Login from './Login.tsx';
import Signup from './Signup.tsx';
import Professor from './professor.tsx';
import Student from './student.tsx';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import AuthRoute from './AuthRoute.tsx';

const firebaseConfig = {
  apiKey: "AIzaSyCbRdbjZWY36SODtKK9kjw0sZ2Ro84rCxs",
  authDomain: "face-ams-1fa9f.firebaseapp.com",
  projectId: "face-ams-1fa9f",
  storageBucket: "face-ams-1fa9f.firebasestorage.app",
  messagingSenderId: "366142425812",
  appId: "1:366142425812:web:a324fa462502a8d1b2c941"
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename="/Face-AMS">
      <Routes>
        <Route path="/" element={<AuthRoute><App /></AuthRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/student" element={<Student />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
