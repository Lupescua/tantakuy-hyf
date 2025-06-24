import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import Modal from "../terms-conditions/Modal";




export default function OrganizationForm() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log('Company form submitted:', formData);
  };
  // Terms & conditions starts
  const [isModalOpen, setModalOpen] = useState(false);
  const [terms, setTerms] = useState("By registering, you agree to the collection and use of your information as described in our Terms of Service.");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTerms, setTempTerms] = useState(terms);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setIsEditing(false);
    setTempTerms(terms);
    setModalOpen(false);
  };

  const saveTerms = () => {
    setTerms(tempTerms);
    setIsEditing(false);
  };
  // Terms and conditions end
  return (
    <><form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className={styles.formItemCompany}>
        <label htmlFor="name">Name</label>
        <br />
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required />
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
          required />
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
          required />
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
          required />
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
          required />
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
          required />
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
          required />
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
          required />
      </div>
      <div className={styles.formItemCompany}>
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required />{' '}
        <label>I accept the terms and conditions</label>

        <p className="hero-subtitle">
          You agree to our{" "}
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={openModal}
          >
            Terms and conditions
          </span>{" "}
          and Privacy Policy.
        </p>
      </div>

      <button className={styles.buttonBlack} type="submit">
        Registration
      </button>
    </form>
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <h2>Terms and conditions</h2>
      {isEditing ? (
          <>
            <textarea
              value={tempTerms}
              onChange={(e) => setTempTerms(e.target.value)}
              rows={10}
              style={{ width: "100%" }}
            />
            <div style={{ marginTop: 10 }}>
              <button onClick={saveTerms}>Save</button>
              <button onClick={closeModal} style={{ marginLeft: 10 }}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p>{terms}</p>
        )}
      </Modal>
    </>
  );
}
