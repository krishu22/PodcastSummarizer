import React, { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { Navigate, Link } from "react-router-dom";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../../config/auth";
import { useAuth } from "../../contexts/authContexts";

const Signup: React.FC = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
      } catch (err: any) {
        setError(err.message);
        setIsSigningUp(false);
      }
    }
  };

  const onGoogleAuth = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError('');
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doSignInWithGoogle();
      } catch (err: any) {
        setError(err.message);
        setIsSigningUp(false);
      }
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-gray-800 to-black flex items-center justify-center p-4">
      <main className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Signup</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required 
              className="w-full p-2 rounded border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required 
              className="w-full p-2 rounded border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Confirm Password:</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required 
              className="w-full p-2 rounded border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSigningUp}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-6 py-2 transition duration-200"
          >
            {isSigningUp ? "Signing Up..." : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">Or</p>
        <button 
          onClick={onGoogleAuth} 
          disabled={isSigningUp}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded px-6 py-2 transition duration-200 w-full"
        >
          {isSigningUp ? "Processing..." : "Signup with Google"}
        </button>
        <p className="mt-4 text-center text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Signup;
