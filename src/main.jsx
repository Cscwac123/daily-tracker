import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import NoteEditor from './pages/NoteEditor';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/daily-tracker">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/note/:id" element={<NoteEditor />} />
        <Route path="/note/new" element={<NoteEditor />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
