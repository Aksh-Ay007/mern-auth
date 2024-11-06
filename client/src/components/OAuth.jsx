import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Google login with Firebase
      const result = await signInWithPopup(auth, provider);
      
      // Sending Google user data to the server
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      // Check if the response status is not ok
      if (!res.ok) {
        throw new Error(`Failed to authenticate with the server: ${res.statusText}`);
      }

      const data = await res.json();  // Get the response data
      console.log('Response data:', data);  // Log the server response
      dispatch(signInSuccess(data));  // Dispatch user data to Redux
      navigate('/');  // Redirect to home page after successful login

    } catch (error) {
      console.error('Could not login with Google:', error.message); // Log general error message
      if (error.code) {
        console.error('Error Code:', error.code); // Log Firebase specific error code if available
      }
      if (error.details) {
        console.error('Error Details:', error.details); // Log additional error details
      }
    }
  };

  return (
    <button
      type='button'
      onClick={handleGoogleClick}
      className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
