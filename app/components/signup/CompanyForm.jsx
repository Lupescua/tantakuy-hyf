import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';

export default function OrganizationForm() {

  const router = useRouter();
  const [error, setError] = useState(null);


  const [formData, setFormData] = useState({
    name: '',
    position: '',
    companyName: '',
    businessNumber: '',
    cvrNumber: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/companies', formData);
      console.log(`result: ${res}`)
      const data = res.json();
      setError('');
      router.push('/');
    } catch (e) {
      const message = e.response?.data?.message || 'Failed to register. Please try again.';
      setError(message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className={styles.formItemCompany}>
        <label htmlFor="name">Name</label>
        <br />
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formItemCompany}>
        <label htmlFor="position">Position</label>
        <br />
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formItemCompany}>
        <label htmlFor="companyName">Company Name</label>
        <br />
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formItemCompany}>
        <label htmlFor="businessNumber">Business Number</label>
        <br />
        <input
          type="text"
          id="businessNumber"
          name="businessNumber"
          value={formData.businessNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formItemCompany}>
        <label htmlFor="cvrNumber">CVR Number</label>
        <br />
        <input
          type="text"
          id="cvrNumber"
          name="cvrNumber"
          value={formData.cvrNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formItemCompany}>
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
      <div className={styles.formItemCompany}>
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

      <div className={styles.formItemCompany}>
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
      <div className={styles.formItemCompany}>
        <input
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

      <button className={styles.buttonBlack} type="submit">
        Registration
      </button>
    </form>
  );
}
