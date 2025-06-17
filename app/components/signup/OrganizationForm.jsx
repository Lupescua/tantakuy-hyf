import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';


export default function OrganizationForm() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    organizationName: '',
    workNumber: '',
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
    console.log('Organization form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <label htmlFor="name">Name</label><br />
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="position">Position</label><br />
      <input
        type="text"
        id="position"
        name="position"
        value={formData.position}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="organizationName">Organization Name</label><br />
      <input
        type="text"
        id="organizationName"
        name="organizationName"
        value={formData.organizationName}
        onChange={handleChange}
        required
      /><br /><br />

      <label htmlFor="workNumber">Work Number</label><br />
      <input
        type="text"
        id="workNumber"
        name="workNumber"
        value={formData.workNumber}
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
