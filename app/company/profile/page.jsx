'use client';
import { useState, useRef } from 'react';
import CompanyProfileNavbar from '../../components/layouts/CompanyProfileNavbar';
import Sidebar from '../../components/layouts/Sidebar';
import styles from './CompanyProfilePage.module.css';
import UploadImageModal from '../../components/modals/uploadImageModal';
import Link from 'next/link';

export default function CompanyProfilePage() {
  // This page is for editing company profile information
  const [cvr, setCvr] = useState('');
  const [hq, setHq] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [about, setAbout] = useState('');
  const [logo, setLogo] = useState(null);
  const [bgImage, setBgImage] = useState(null);
//open modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('logo');

 //function for opening modal
  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };
  // function for handling image upload
  const handleImageUpload = (url) => {
    if (modalType === 'logo') setLogo(url);
    else setBgImage(url);
    setModalOpen(false);
  };

  const fileInputRef = useRef();

  const handleAttachFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const bgFileInputRef = useRef();

  const handleAttachBgFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Virksomhedsoplysninger</h1>
        <div
          className={`${styles.logoCircle} ${styles['logoCircle--editable']}`}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            'LOGO'
          )}
          <span className={styles.editPencil}>✎</span>
        </div>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoCol}>
          <label>CVR nummer</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={cvr}
              onChange={e => setCvr(e.target.value)}
              placeholder="XX-XXXXXXX"
            />
            <span className={styles.editIcon} />
          </div>
          <label>Hovedkontor</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={hq}
              onChange={e => setHq(e.target.value)}
              placeholder="XX-XXXXXXX"
            />
            <span className={styles.editIcon} />
          </div>
        </div>
        <div className={styles.infoCol}>
          <label>Website</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="XXX-XXX"
            />
            <span className={styles.editIcon} />
          </div>
          <label>LinkedIn</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="XXX-XXX"
            />
            <span className={styles.editIcon} />
          </div>
          <label>Facebook</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={facebook}
              onChange={e => setFacebook(e.target.value)}
              placeholder="XXX-XXX"
            />
            <span className={styles.editIcon} />
          </div>
          <label>Instagram</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              placeholder="XXX-XXX"
            />
            <span className={styles.editIcon} />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <label>Om:</label>
        <textarea
          className={styles.textarea}
          value={about}
          onChange={e => setAbout(e.target.value)}
          placeholder="Om virksomheden..."
        />
      </div>
      <div className={styles.section}>
        <label>Logo</label>
        <div className={styles.uploadBox}>
          <div className={styles.uploadText}>Upload or drag and drop your files<br/>PDF, PNG, JPG (Max 10MB)</div>
          <div className={styles.uploadActions}>
            <button
              className={styles.uploadBtn}
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              Attach file
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAttachFile}
            />
            <button className={styles.uploadBtn}>Insert link</button>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <label>Baggrundsbillede</label>
        <div className={styles.uploadBox}>
          <div className={styles.uploadText}>Upload or drag and drop your files<br/>PDF, PNG, JPG (Max 10MB)</div>
          <div className={styles.uploadActions}>
            <button
              className={styles.uploadBtn}
              type="button"
              onClick={() => bgFileInputRef.current && bgFileInputRef.current.click()}
            >
              Attach file
            </button>
            <input
              type="file"
              accept="image/*"
              ref={bgFileInputRef}
              style={{ display: 'none' }}
              onChange={handleAttachBgFile}
            />
            <button className={styles.uploadBtn}>Insert link</button>
          </div>
          {bgImage && (
            <div style={{ marginTop: 12 }}>
              <img src={bgImage} alt="Background preview" style={{ maxWidth: 200, maxHeight: 80, borderRadius: 8 }} />
            </div>
          )}
        </div>
      </div>
      <UploadImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpload={handleImageUpload}
      />
      <div className={styles.nextButtonContainer}>
        <Link href="/company/profile/next">
          <button className={styles.nextButton} type="button">Next</button>
        </Link>
      </div>
    </div>
  );
}
