import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SchoolRegistration from './pages/SchoolRegistration';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import News from './pages/News';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SchoolRegistration />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
};

export default App;
