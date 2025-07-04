'use client';
import { useState, useRef } from 'react';
import CompanyProfileNavbar from '../../components/layouts/CompanyProfileNavbar';
import Sidebar from '../../components/layouts/Sidebar';
import styles from './CompanyProfilePage.module.css';
import UploadImageModal from '../../components/modals/uploadImageModal';

export default function CompanyProfilePage() {
  // This page is for editing company profile information
  const [cvr, setCvr] = useState('XX-XXXXXXX');
  const [hq, setHq] = useState('XX-XXXXXXX');
  const [website, setWebsite] = useState('XXX-XXX');
  const [linkedin, setLinkedin] = useState('XXX-XXX');
  const [facebook, setFacebook] = useState('XXX-XXX');
  const [instagram, setInstagram] = useState('XXX-XXX');
  const [about, setAbout] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.');
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
            <input className={styles.input} value="xx-xxxxxxx" readOnly />
            <span className={styles.editIcon} />
          </div>
          <label>Hovedkontor</label>
          <div className={styles.inputRow}>
            <input className={styles.input} value="xx-xxxxxxx" readOnly />
            <span className={styles.editIcon} />
          </div>
        </div>
        <div className={styles.infoCol}>
          <label>Website: XXX-XXX</label>
          <span className={styles.editIcon} />
          <label>LinkedIn: XXX-XXX</label>
          <span className={styles.editIcon} />
          <label>Facebook: XXX-XXX</label>
          <span className={styles.editIcon} />
          <label>Instagram: XXX-XXX</label>
          <span className={styles.editIcon} />
        </div>
      </div>
      <div className={styles.section}>
        <label>Om:</label>
        <textarea className={styles.textarea} value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus." readOnly />
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
    </div>
  );
}
