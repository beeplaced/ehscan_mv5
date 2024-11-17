// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Images from './routes/Images';
import ImageResult from './routes/ImageResult';
import ProjectResult from './routes/ProjectResult';
import ProjectView from './routes/ProjectView';
import StartPage from './routes/StartPage';
import ProjectOverview from './routes/ProjectOverview';
import Menu from './routes/Menu';
import { WebSocketProvider } from './tools/WebSocketContext';

const App: React.FC = () => {

  useEffect(() => {

  //localStorage.clear();
  let settings = JSON.parse(localStorage.getItem('settings')) || { 
    darkmode: false,
    imagerepeat: 5,
    projectflow: true,
    lang: 'en',
    sortby: 'byscore'
  };
  if (!localStorage.getItem('settings')) localStorage.setItem('settings', JSON.stringify(settings));
  localStorage.setItem('userId','user-123') //persistent
  localStorage.setItem('tenant','demo_mv5') //persistent
  }, []);

  return (
    <WebSocketProvider>
    <Router>
      <Routes>
        <Route path="/:id" element={<ProjectView />} />
        <Route path="/" element={<StartPage />} />
        <Route path="/result/:id" element={<ImageResult />} />
        <Route path="/assessment/:id" element={<ProjectResult />} />
        <Route path="/projectoverview/" element={<ProjectOverview />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
    </WebSocketProvider>
  );
};


export default App;
