import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import Modal from '../terms-conditions/Modal';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';

export default function RegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const { refresh } = useAuth();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

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
      setError('Passwords do not match.');
      return;
    }

    //the loader
    setLoading(true);
    setError(null);

    try {
      // 1. Register user
      await API.post('/participants', formData);

      // // we are forcing AUthContext to reload the user, this was causing a bug in the UI (it was both logged in and logged out after creating a participant)
      // await refresh(); // still not working for some reason, I'm just disabling auto login when you create a user.

      // 2. Redirect and let AuthContext rehydrate
      router.push('/');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to register. Please try again.';
      setError(message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };
  // Terms & conditions starts
  const [isModalOpen, setModalOpen] = useState(false);
  const [terms, setTerms] = useState(
    'By registering, you agree to the collection and use of your information as described in our Terms of Service.',
  );
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
  const [privacy, setPrivacy] = useState('This is the default privacy policy.');
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
    <>
      <>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: '400px', margin: 'auto' }}
        >
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

          <div className={styles.formItem}>
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
              You agree to our{' '}
              <span
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={openModal}
              >
                Terms and Conditions
              </span>{' '}
              and{' '}
              <span
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={openPrivacyModal}
              >
                Privacy Policy
              </span>
              .
            </p>
          </div>

          {/* displaying any errors */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* the button will inactive while loading */}
          <button
            className={styles.buttonBlack}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Registration →'}
          </button>
        </form>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className={styles.termsModalTitle}>Terms and conditions</h2>
          {isEditing ? (
            <>
              <textarea
                className={styles.textModal}
                f
                value={tempTerms}
                onChange={(e) => setTempTerms(e.target.value)}
                rows={10}
                style={{ width: '100%' }}
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
      <Modal isOpen={isPrivacyOpen} onClose={closePrivacyModal}>
        <h2>Privacy Policy</h2>
        {isPrivacyEditing ? (
          <>
            <textarea
              value={tempPrivacy}
              onChange={(e) => setTempPrivacy(e.target.value)}
              rows={10}
              style={{ width: '100%' }}
            />
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
