import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import Modal from '../terms-conditions/Modal';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

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
      console.log(`result: ${res}`);
      const data = res.data;
      setError('');
      router.push('/');
    } catch (err) {
      const payload = err.response?.data || {};
      const msg = payload.error || payload.message || 'Registrering mislykkedes';
      console.error('Registration error:', msg);
      setError(msg);
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
          {error && <div className={styles.warningText}>{error}</div>}
          <div className={styles.formItemCompany}>
            <label htmlFor="name">Navn</label>
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
            <label htmlFor="position">Stilling</label>
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
            <label htmlFor="companyName">Firmanavn</label>
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
            <label htmlFor="businessNumber">Mobilnummer</label>
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
            <label htmlFor="cvrNumber">CVR-nummer</label>
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
            <label htmlFor="email">E-mail</label>
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

          <div className={styles.formItemCompany}>
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
            <label htmlFor="confirmPassword">Bekræft adgangskode</label>
            <br />
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
          <div className={styles.formItemCompany}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />{' '}
            <label>Jeg accepterer vilkår og betingelser</label>
            <p className="hero-subtitle">
              Du accepterer vores{' '}
              <span
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={openModal}
              >
                Vilkår og betingelser
              </span>{' '}
              og{' '}
              <span
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={openPrivacyModal}
              >
                Privatlivspolitik
              </span>
              .
            </p>
          </div>

          <button className={styles.buttonBlack} type="submit">
            Opret virksomhed
          </button>
        </form>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Vilkår og betingelser</h2>
          {isEditing ? (
            <>
              <textarea
                value={tempTerms}
                onChange={(e) => setTempTerms(e.target.value)}
                rows={10}
                style={{ width: '100%' }}
              />
              <div style={{ marginTop: 10 }}>
                <button onClick={saveTerms}>Gem</button>
                <button onClick={closeModal} style={{ marginLeft: 10 }}>
                  Annuller
                </button>
              </div>
            </>
          ) : (
            <p>{terms}</p>
          )}
        </Modal>
      </>
      <Modal isOpen={isPrivacyOpen} onClose={closePrivacyModal}>
        <h2>Privatlivspolitik</h2>
        {isPrivacyEditing ? (
          <>
            <textarea
              value={tempPrivacy}
              onChange={(e) => setTempPrivacy(e.target.value)}
              rows={10}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: 10 }}>
              <button onClick={savePrivacy}>Gem</button>
              <button onClick={closePrivacyModal} style={{ marginLeft: 10 }}>
                Annuller
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
