'use client';
import { useState } from 'react';
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

  return (
    <div className={styles.profileContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Virksomhedsoplysninger</h1>
        <div className={styles.logoCircle}>LOGO</div>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoLeft}>
          <label className={styles.label}>CVR nummer</label>
          <input className={styles.input} type="text" placeholder="xx-xxxxxxx" />
          <label className={styles.label}>Hovedkontor</label>
          <input className={styles.input} type="text" placeholder="xx-xxxxxxx" />
        </div>
        <div className={styles.infoRight}>
          <label className={styles.label}>Website: XXX-XXX</label>
          <input className={styles.input} type="text" placeholder="Website: XXX-XXX" />
          <label className={styles.label}>LinkedIn: XXX-XXX</label>
          <input className={styles.input} type="text" placeholder="LinkedIn: XXX-XXX" />
          <label className={styles.label}>Facebook: XXX-XXX</label>
          <input className={styles.input} type="text" placeholder="Facebook: XXX-XXX" />
          <label className={styles.label}>Instagram: XXX-XXX</label>
          <input className={styles.input} type="text" placeholder="Instagram: XXX-XXX" />
        </div>
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Om:</label>
        <textarea className={styles.textarea} placeholder="Om virksomheden..." rows={3} />
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Logo</label>
        <div className={styles.uploadBox}>Upload or drag and drop your files<br /><span>PDF, PNG, JPG (Max 10MB)</span></div>
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Baggrundsbillede</label>
        <div className={styles.uploadBox}>Upload or drag and drop your files<br /><span>PDF, PNG, JPG (Max 10MB)</span></div>
      </div>
    </div>
  );
}
