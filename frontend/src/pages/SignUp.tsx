// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Purpose } from '../types/auth';
// import { useAuth } from '../context/AuthContext';

// export default function SignUp() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [purpose, setPurpose] = useState<Purpose>('testing');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const purposes: Purpose[] = ['testing', 'development', 'production', 'learning'];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }
//     // In a real app, you would create the user account here
//     login({ username, purpose });
//     navigate('/chat');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//               Username
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <input
//               id="confirmPassword"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full px-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
//               Purpose
//             </label>
//             <select
//               id="purpose"
//               value={purpose}
//               onChange={(e) => setPurpose(e.target.value as Purpose)}
//               className="w-full px-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             >
//               {purposes.map((p) => (
//                 <option key={p} value={p}>
//                   {p.charAt(0).toUpperCase() + p.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
//           >
//             Sign Up
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <button
//             onClick={() => navigate('/signin')}
//             className="text-teal-600 hover:text-teal-700"
//           >
//             Sign In
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming you're using context to manage authentication state

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming you have a login function in your AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Make a POST request to the backend /signup endpoint
      const requestBody={
        username:username,
        password: password
    }
    const response = await fetch('http://localhost:8000/auth/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });
    console.log(response);
      if (response.ok) {
      // Handle success (e.g., store the token or user data in localStorage/context)
      login({
        username,
        purpose: 'testing'
      }); // Update the auth context

      // Navigate to the chat page
      navigate('/chat');
    }
    } catch (err) {
      console.error('Sign Up Error:', err);
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/signin')}
            className="text-teal-600 hover:text-teal-700"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
