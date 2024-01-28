import React, { useState } from 'react';
import '../index.css'; // Import the CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [error, setError] = useState('');

  const isEmailValid = (email) => {
    // Simple email format validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailExists = async (email) => {
    try {
      const response = await fetch('http://localhost:4000/checkEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const { exists } = await response.json();
        return exists;
      } else {
        throw new Error('Unable to check email existence');
      }
    } catch (error) {
      console.error('Error checking email existence:', error.message);
      throw error;
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      // Check if the email is in the correct format
      if (!isEmailValid(email)) {
        throw new Error('Invalid email format');
      }

      // Check if the email already exists in the database
      const emailAlreadyExists = await emailExists(email);
      if (emailAlreadyExists) {
        throw new Error('Email already exists');
      }

      // Check if the password and confirm password match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setSignupSuccess(true);
        setError('');
        console.log('Signup successful!');
      } else {
        setSignupSuccess(false);
        setError('Signup failed. Please try again.');
        console.error('Signup failed');
      }
    } catch (error) {
      setSignupSuccess(false);
      setError(`Error during signup: ${error.message}`);
      console.error('Error during signup:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form className="signup-form">
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="button" onClick={handleSignup} disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>

        {signupSuccess && <p className="success-message">Signup successful!</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
