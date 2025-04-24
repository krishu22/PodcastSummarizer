import React from 'react';
import HandleUpload from '../components/core/HandleUpload';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="bg-blue-900 w-full max-w-7xl p-4 rounded-xl shadow-lg">
        <HandleUpload />
      </div>
    </div>
  );
};

export default Home;
