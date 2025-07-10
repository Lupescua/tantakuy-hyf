import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log('Organization form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className={styles.formItemOrg}>
        <label htmlFor="name">Navn</label>
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
        <label htmlFor="position">Stilling</label>
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
        <label htmlFor="organizationName">Organisationsnavn</label>
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
        <label htmlFor="workNumber">Arbejdsnummer</label>
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
        <label htmlFor="email">E-mail</label>
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
<<<<<<< HEAD
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
          {showPassword ? (
            <AiOutlineEye
              onClick={togglePasswordVisibility}
              className={styles.passwordToggleIcon}
            />
          ) : (
            <AiOutlineEyeInvisible
              onClick={togglePasswordVisibility}
              className={styles.passwordToggleIcon}
            />
          )}
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
          {showConfirmPassword ? (
            <AiOutlineEye
              onClick={toggleConfirmPasswordVisibility}
              className={styles.passwordToggleIcon}
            />
          ) : (
            <AiOutlineEyeInvisible
              onClick={toggleConfirmPasswordVisibility}
              className={styles.passwordToggleIcon}
            />
          )}
        </div>
=======
        <label htmlFor="password">Adgangskode</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItemOrg}>
        <label htmlFor="confirmPassword">Bekræft adgangskode</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
>>>>>>> e3d931f (Translated from english to danish all pages part 2)
      </div>

      <div className={styles.formItemOrg}>
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
        />
        <label> Jeg accepterer vilkår og betingelser</label>

        <p className="hero-subtitle">
          Du accepterer vores Vilkår for brug og Privatlivspolitik.
        </p>
      </div>

      <button className={styles.buttonBlack} type="submit">
        Opret organisation
      </button>
    </form>
  );
}
