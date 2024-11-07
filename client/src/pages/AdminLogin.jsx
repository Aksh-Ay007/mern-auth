import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import Cookies from 'js-cookie';
import { store } from '../redux/store'

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

   
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { username, password }, { withCredentials: true });
      if (response.status === 200) {
        dispatch(signInSuccess({
          token: response.data.token,
          username: response.data.username,
          isAdmin: response.data.isAdmin, // Ensure this is included in the payload
        }));
        
          console.log('Dispatched signInSuccess, currentUser :', store.getState().user.currentUser ); // This line should be inside the component
          Cookies.set('access_token', response.data.token, { expires: 1 });
          navigate('/admin/dashboard');
      }
  }catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleAdminLogin} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Admin Login</h2>
        {error && <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</div>}
        <div className="mb-4">
          <input
            type="text"
            className="border border-gray-300 w-full p-3 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="border border-gray-300 w-full p-3 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-600 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
