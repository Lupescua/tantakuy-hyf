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
      const msg = payload.error || payload.message || 'Registration failed';
      console.error('Registration error:', msg);
      setError(msg);
    }
  };
  // Terms & conditions starts
  const [isModalOpen, setModalOpen] = useState(false);
  const [terms, setTerms] = useState(`
    <div style="line-height: 1.6; font-size: 14px;">
      <p><strong>1. Deltagelse</strong></p>
      <p>Ved at deltage i konkurrencen accepterer deltageren disse betingelser. Deltagelse er frivillig og ikke købsbetinget.</p>
      
      <p><strong>2. Opbevaring af oplysninger</strong></p>
      <p>Vi gemmer oplysninger om deltagernes navn, e-mail og deltagelsesdato med det formål at kunne administrere konkurrencen og kontakte vinderen. Oplysningerne behandles fortroligt og slettes efter konkurrencens afslutning, medmindre andet er aftalt.</p>
      
      <p><strong>3. Udvælgelse og kontakt</strong></p>
      <p>Vinderen trækkes lod blandt deltagerne og får direkte besked via e-mail eller anden kontaktform oplyst ved deltagelsen. Hvis vi ikke får svar fra vinderen inden for 7 dage, forbeholder vi os retten til at udpege en ny vinder.</p>
      
      <p><strong>4. Præmie</strong></p>
      <p>Præmien kan ikke ombyttes til kontanter eller andre varer og kan ikke overdrages til andre.</p>
      
      <p><strong>5. Offentliggørelse</strong></p>
      <p>Ved deltagelse giver deltageren samtykke til, at Tantakuy må offentliggøre fornavn og by på vinderen i forbindelse med annoncering af konkurrencens resultat, fx på sociale medier og/eller vores hjemmeside.</p>
      
      <p><strong>6. Ændringer og forbehold</strong></p>
      <p>Tantakuy forbeholder sig retten til at ændre eller aflyse konkurrencen uden varsel, hvis nødvendigt.</p>
    </div>
  `);
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

          <button className={styles.buttonBlack} type="submit">
            Registration
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
                <button onClick={saveTerms}>Save</button>
                <button onClick={closeModal} style={{ marginLeft: 10 }}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: terms }} />
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
