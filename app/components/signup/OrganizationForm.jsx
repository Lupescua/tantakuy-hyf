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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log('Organization form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className={styles.formItemOrg}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItemOrg}>
        <label htmlFor="position">Position</label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItemOrg}>
        <label htmlFor="organizationName">Organization Name</label>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItemOrg}>
        <label htmlFor="workNumber">Work Number</label>
        <input
          type="text"
          id="workNumber"
          name="workNumber"
          value={formData.workNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItemOrg}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItemOrg}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <img
            src="/eye.png"
            alt="Toggle password visibility"
            onClick={togglePasswordVisibility}
            className={styles.passwordToggleIcon}
          />
        </div>
      </div>

      <div className={styles.formItemOrg}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <img
            src="/eye.png"
            alt="Toggle confirm password visibility"
            onClick={toggleConfirmPasswordVisibility}
            className={styles.passwordToggleIcon}
          />
        </div>
      </div>

      <div className={styles.formItemOrg}>
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
        />
        <label> I accept the terms and conditions</label>

        <p className="hero-subtitle">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <button className={styles.buttonBlack} type="submit">
        Registration
      </button>
    </form>
  );
}
