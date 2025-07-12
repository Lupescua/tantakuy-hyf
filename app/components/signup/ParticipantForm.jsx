import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import Modal from '../terms-conditions/Modal';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

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
  const [privacy, setPrivacy] = useState('Dette er standardprivatlivspolitikken.');
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
            <label htmlFor="userName">Brugernavn</label>
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
            <label htmlFor="password">Adgangskode</label>
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

          <div className={styles.formItem}>
            <label htmlFor="confirmPassword">Bekræft adgangskode</label>
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

          <div className={styles.formItem}>
            <input
              className={styles.formCheckbox}
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

          {/* displaying any errors */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* the button will inactive while loading */}
          <button
            className={styles.buttonBlack}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registrerer...' : 'Registrering →'}
          </button>
        </form>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className={styles.termsModalTitle}>Vilkår og betingelser</h2>
          {isEditing ? (
            <>
              <textarea
                className={styles.textModal}
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
            <div dangerouslySetInnerHTML={{ __html: terms }} />
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
