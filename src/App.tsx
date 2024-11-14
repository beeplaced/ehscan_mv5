// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Images from './routes/Images';
import ImageResult from './routes/ImageResult';
import ProjectResult from './routes/ProjectResult';
import ProjectView from './routes/ProjectView';

import Menu from './routes/Menu';
import { WebSocketProvider } from './tools/WebSocketContext';

const App: React.FC = () => {

useEffect(() => {
//localStorage.clear();
let settings = JSON.parse(localStorage.getItem('settings')) || { darkmode: false, imagerepeat: 5, projectflow: true, lang: 'en' };
if (!localStorage.getItem('settings')) localStorage.setItem('settings', JSON.stringify(settings));
localStorage.setItem('userId','user-123') //persistent
localStorage.setItem('tenant','demo_mv5') //persistent
}, []);

  return (
    <WebSocketProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Images />} />
        <Route path="/result/:id" element={<ImageResult />} />
        <Route path="/assessment/:id" element={<ProjectResult />} />
        <Route path="/projectview/:id" element={<ProjectView />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
    </WebSocketProvider>
  );
};

export default App;
