import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContexts';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

const App: React.FC = () => {
  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Optional: Redirect the root path to home or login */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  );
};

export default App;
