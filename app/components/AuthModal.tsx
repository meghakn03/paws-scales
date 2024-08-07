import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import your context
import SuccessAnimation from './SuccessAnimation'; // Import the animation component
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import peekingCat from '../animations/peekingCat.json'; // Import the peeking cat animation
import Lottie from 'react-lottie';

// Define possible positions for the peeking cat animation
const positions = [
  { bottom: '1px', left: '10px', transform: 'translate(0, 0)' }, // Bottom-left
  { bottom: '1px', right: '10px', transform: 'translate(0, 0)' }, // Bottom-right
];

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
  const [animationStyle, setAnimationStyle] = useState({}); // State for animation position

  useEffect(() => {
    if (isOpen) {
      // Randomly select a position
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      setAnimationStyle(randomPosition);
    }
  }, [isOpen]);

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

  // Define default options for the Lottie animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: peekingCat,
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-md shadow-md relative"> {/* Added relative positioning */}
        {showSuccess ? (
      <div className="successAnimationContainer">
        <SuccessAnimation />
      </div>
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
                  className="w-full bg-black text-white p-2 rounded-md mb-4" // Changed to black
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>
              {message && <p className="text-red-500">{message}</p>}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-black-500"
              >
                {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
              </button>
            </>
          )}
          {/* Conditionally render peeking cat animation */}
          {!showSuccess && (
      <div 
        className="absolute" 
        style={{ 
          ...animationStyle,
          width: '150px', 
          height: '150px' 
        }}
      >
        <Lottie options={defaultOptions} height={150} width={150} />
      </div>
    )}
  </div>
</div>
    )
  );
};

export default AuthModal;
