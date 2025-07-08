import React, { useState } from 'react';
import styles from '../../../style/forms.module.css';
import Modal from '../terms-conditions/Modal';

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

  const [isModalOpen, setModalOpen] = useState(false);
  const [terms, setTerms] = useState(`Betingelser for deltagelse i konkurrencen
1. Deltagelse
Ved at deltage i konkurrencen accepterer deltageren disse betingelser. Deltagelse er frivillig og ikke købsbetinget.
2. Opbevaring af oplysninger
Vi gemmer oplysninger om deltagernes navn, e-mail og deltagelsesdato med det formål at kunne administrere konkurrencen og kontakte vinderen. Oplysningerne behandles fortroligt og slettes efter konkurrencens afslutning, medmindre andet er aftalt.
3. Udvælgelse og kontakt
Vinderen trækkes lod blandt deltagerne og får direkte besked via e-mail eller anden kontaktform oplyst ved deltagelsen. Hvis vi ikke får svar fra vinderen inden for 7 dage, forbeholder vi os retten til at udpege en ny vinder.
4. Præmie
Præmien kan ikke ombyttes til kontanter eller andre varer og kan ikke overdrages til andre.
5. Offentliggørelse
Ved deltagelse giver deltageren samtykke til, at Tantakuy må offentliggøre fornavn og by på vinderen i forbindelse med annoncering af konkurrencens resultat, fx på sociale medier og/eller vores hjemmeside.
6. Ændringer og forbehold
Tantakuy forbeholder sig retten til at ændre eller aflyse konkurrencen uden varsel, hvis nødvendigt.`);
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

  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [privacy, setPrivacy] = useState('Dette er standard privatlivspolitik.');
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
        <label> Jeg accepterer vilkår og betingelser</label>
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
          </span>
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
          <div className="termsContent">
            <strong>Betingelser for deltagelse i konkurrencen</strong>
            <ol>
              <li><span className="termTitle">Deltagelse</span>&nbsp;Ved at deltage i konkurrencen accepterer deltageren disse betingelser. Deltagelse er frivillig og ikke købsbetinget.</li>
              <li><span className="termTitle">Opbevaring af oplysninger</span>&nbsp;Vi gemmer oplysninger om deltagernes navn, e-mail og deltagelsesdato med det formål at kunne administrere konkurrencen og kontakte vinderen. Oplysningerne behandles fortroligt og slettes efter konkurrencens afslutning, medmindre andet er aftalt.</li>
              <li><span className="termTitle">Udvælgelse og kontakt</span>&nbsp;Vinderen trækkes lod blandt deltagerne og får direkte besked via e-mail eller anden kontaktform oplyst ved deltagelsen. Hvis vi ikke får svar fra vinderen inden for 7 dage, forbeholder vi os retten til at udpege en ny vinder.</li>
              <li><span className="termTitle">Præmie</span>&nbsp;Præmien kan ikke ombyttes til kontanter eller andre varer og kan ikke overdrages til andre.</li>
              <li><span className="termTitle">Offentliggørelse</span>&nbsp;Ved deltagelse giver deltageren samtykke til, at Tantakuy må offentliggøre fornavn og by på vinderen i forbindelse med annoncering af konkurrencens resultat, fx på sociale medier og/eller vores hjemmeside.</li>
              <li><span className="termTitle">Ændringer og forbehold</span>&nbsp;Tantakuy forbeholder sig retten til at ændre eller aflyse konkurrencen uden varsel, hvis nødvendigt.</li>
            </ol>
          </div>
        )}
      </Modal>

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

      <button className={styles.buttonBlack} type="submit">
        Registration
      </button>
    </form>
  );
}
