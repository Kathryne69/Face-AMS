import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Login from './Login.tsx';
import Signup from './Signup.tsx';
import Professor from './professor.tsx';
import Student from './student.tsx';
import './index.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import AuthRoute from './AuthRoute.tsx';

const firebaseConfig = {
  apiKey: "AIzaSyCbRdbjZWY36SODtKK9kjw0sZ2Ro84rCxs",
  authDomain: "face-ams-1fa9f.firebaseapp.com",
  databaseURL: "https://face-ams-1fa9f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "face-ams-1fa9f",
  storageBucket: "face-ams-1fa9f.firebasestorage.app",
  messagingSenderId: "366142425812",
  appId: "1:366142425812:web:a324fa462502a8d1b2c941"
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/professor" element={<AuthRoute><Professor /></AuthRoute>} />
        <Route path="/student" element={<AuthRoute><Student /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
