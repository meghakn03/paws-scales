import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import your context
import SuccessAnimation from './SuccessAnimation'; // Import the animation component
import { FaTimes, FaCheckCircle } from 'react-icons/fa';


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void; // Update here
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup only
  const [message, setMessage] = useState('');
  const { setUser } = useAuth(); // Use the context
  const [showSuccess, setShowSuccess] = useState(false); // State for showing success animation



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      onLogin(data); // Pass userData here
      setUser(data); // Set the user in context
      setShowSuccess(true); // Show success animation
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      // Type assertion to handle 'unknown' type error
      setMessage('Login failed: ' + (error as Error).message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const data = await response.json();
      onLogin(data); // Pass userData here
      setUser(data); // Set the user in context
      setShowSuccess(true); // Show success animation
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500); 
    } catch (error) {
      // Type assertion to handle 'unknown' type error
      setMessage('Signup failed: ' + (error as Error).message);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-md shadow-md">
          {showSuccess ? (
            <SuccessAnimation /> // Show animation on success
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
              <form onSubmit={isLogin ? handleLogin : handleSignup}>
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded-md mb-4"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>
              {message && <p className="text-red-500">{message}</p>}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-blue-500"
              >
                {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
              </button>
            </>
          )}
        </div>
      </div>
    )
  );
};


export default AuthModal;
