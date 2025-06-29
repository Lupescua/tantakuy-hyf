import React, { useState } from 'react';
import styles from '../../../style/forms.module.css'
import Modal from "../terms-conditions/Modal";




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

//Privacy Policy starts
const [isPrivacyOpen, setPrivacyOpen] = useState(false);
const [privacy, setPrivacy] = useState("This is the default privacy policy.");
const [tempPrivacy, setTempPrivacy] = useState(privacy);
const [isPrivacyEditing, setIsPrivacyEditing] = useState(false);

const openPrivacyModal = () => setPrivacyOpen(true);
const closePrivacyModal = () => {
  setIsPrivacyEditing(false);
  setTempPrivacy(privacy);
  setPrivacyOpen(false);
};

const savePrivacy = () => {
  setPrivacy(tempPrivacy);
  setIsPrivacyEditing(false);
};
// Privacy Policy ends
  return (
    <><><form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className={styles.formItem}>
        <label htmlFor="userName">Username</label>
        <br />
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required />
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
          required />
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
          required />
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
          required />
      </div>

      <div className={styles.formItem}>
        <input
          className={styles.formCheckbox}
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
            Terms and Conditions
          </span>{" "}
          and{" "}
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={openPrivacyModal}
          >
            Privacy Policy
          </span>.
        </p>

      </div>

      <button className={styles.buttonBlack} type="submit">
        Registration →
      </button>
    </form>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className={styles.termsModalTitle}>Terms and conditions</h2>
        {isEditing ? (
          <>
            <textarea
            className={styles.textModal}f
              value={tempTerms}
              onChange={(e) => setTempTerms(e.target.value)}
              rows={10}
              style={{ width: "100%" }} />
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
    </><Modal isOpen={isPrivacyOpen} onClose={closePrivacyModal}>
        <h2>Privacy Policy</h2>
        {isPrivacyEditing ? (
          <>
            <textarea
              value={tempPrivacy}
              onChange={(e) => setTempPrivacy(e.target.value)}
              rows={10}
              style={{ width: "100%" }} />
            <div style={{ marginTop: 10 }}>
              <button onClick={savePrivacy}>Save</button>
              <button onClick={closePrivacyModal} style={{ marginLeft: 10 }}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p>{privacy}</p>
        )}

      </Modal>
      </>


);
}
