import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';

export default function RegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  //I added this loader to disable the form while loading
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check for password matching 
    if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
    }

    //the loader 
    setLoading(true);
    setError(null);

    try {
    await API.post('/participants', formData);
    router.push('/');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to register. Please try again.';
      setError(message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className={styles.formItem}>
        <label htmlFor="userName">Username</label>
        <br />
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItem}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formItem}>
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formItem}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <br />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItem}>
        <input
          className={styles.formCheckbox}
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
        />{' '}
        <label>I accept the terms and conditions</label>
        <p className="hero-subtitle">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
      
      {/* displaying any errors */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* the button will inactive while loading */}
      <button className={styles.buttonBlack} type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Registration →'}
      </button>
    </form>
  );
}
