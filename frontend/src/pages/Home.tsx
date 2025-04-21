import React from 'react';
import { useAuth } from '../contexts/authContexts';
import Login from '../components/auth/Login';
import HandleUpload from '../components/core/HandleUpload';
import Signup from '../components/auth/Signup';

const Home: React.FC = () => {
  const { currentUser, userLoggedIn } = useAuth();

  return (
    <div className="min-h-screen w-[100%] bg-gradient-to-b from-blue-200 via-gray-800 to-blue-800 flex items-center justify-center my-[-30px]">
      <div className="bg-gray-800 mx-[30px] p-8 rounded-lg shadow-xl w-[100%] max-w-[100vw] md:max-w-[100vw] h-[85vh]">
        {userLoggedIn && currentUser ? (
          <HandleUpload />
        ) : (
          <div>
            <p className="text-gray-300 mb-4 text-center">
              You are not logged in.
            </p>
            <Login />
            <Signup />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
