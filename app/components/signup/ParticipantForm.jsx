import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';


export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <label htmlFor="userName">User Name</label><br />
      <input
        type="text"
        id="userName"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="email">Email</label><br />
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="password">Password</label><br />
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="confirmPassword">Confirm Password</label><br />
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      /><br /><br />

      <label>
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
        />{' '}
        I accept the terms and conditions
      </label>
      <p className='hero-subtitle'>You agree to our Terms of Service and Privacy Policy.</p>
      <br /><br />

      <button className={styles.buttonBlack} type="submit">Registration</button>
    </form>
  );
}
