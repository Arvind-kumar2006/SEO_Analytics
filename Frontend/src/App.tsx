import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Report from './pages/Report';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report/:reportId" element={<Report />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
