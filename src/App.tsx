// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Images from './routes/Images';

import Start from './routes/Start';
import ImageResult from './routes/ImageResult';
import ProjectResult from './routes/ProjectResult';
import ProjectView from './routes/ProjectView';
import ProjectOverview from './routes/ProjectOverview';
import Settings from './routes/Settings';
import Account from './routes/Account';
import { WebSocketProvider } from './tools/WebSocketContext';

const App: React.FC = () => {

  return (
    <WebSocketProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/:id" element={<ProjectView />} />
        <Route path="/result/:id" element={<ImageResult />} />
        <Route path="/assessment/:id" element={<ProjectResult />} />
        <Route path="/projectoverview/" element={<ProjectOverview />} />
        <Route path="/settings/" element={<Settings />} />
        <Route path="/account/" element={<Account />} />
      </Routes>
    </Router>
    </WebSocketProvider>
  );
};

export default App;
