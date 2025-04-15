import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContexts';
import { doSignOut } from '../config/auth';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

const Home: React.FC = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Welcome to Home!</h1>
        {userLoggedIn && currentUser ? (
          <div className="text-center">
            <p className="text-gray-300 mb-4">You are logged in as {currentUser.email}</p>
            <button
              onClick={handleSignOut}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-6 py-2 transition duration-200"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-4 text-center">You are not logged in.</p>
            <Login />
            <Signup />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
