import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCamera,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { faImage, faImages } from '@fortawesome/free-regular-svg-icons';
import Loader from '../loader/Loader';
import API from '@/utils/axios';
import styles from './UploadImageModal.module.css';

export default function UploadImageModal({
  isOpen,
  onClose,
  onImageUpload,
  userId,
  title = 'Upload dit billede',
  showGallery = true,
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showGallery && userId) {
      API.get('/entries/get-entries-images', { params: { userId } })
        .then((resp) => {
          if (resp.data.success) {
            setGallery(resp.data.data.map((item) => item.imageUrl));
          } else {
            console.error('Gallery fetch failed:', resp.data.message);
          }
        })
        .catch((err) => console.error('Gallery fetch error:', err));
    }
  }, [showGallery, userId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const resp = await API.post('/upload', formData);
      const url = resp.data.url;
      setImageUrl(url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGallery = (url) => {
    setSelectedImageUrl(url);
  };

  const handleConfirm = () => {
    const finalUrl = selectedImageUrl || imageUrl;
    if (finalUrl) onImageUpload(finalUrl);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {loading && (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      )}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleBar}>
          <button onClick={onClose} className={styles.closeButton}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          <h2 className={styles.barTitle}>{title}</h2>
          {(imageUrl || selectedImageUrl) && (
            <button onClick={handleConfirm} className={styles.nextButton}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>

        <div
          className={styles.imageContainer}
          style={{
            backgroundImage: selectedImageUrl
              ? `url(${selectedImageUrl})`
              : imageUrl
                ? `url(${imageUrl})`
                : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!selectedImageUrl && !imageUrl && (
            <FontAwesomeIcon
              icon={faImage}
              size="4x"
              className={styles.imageIcon}
            />
          )}
        </div>

        <div className={styles.uploadFunctionContainer}>
          <div className={styles.uploadFuncBar}>
            <div className={styles.UploadTextIconContain}>
              <h3 className={styles.uploadLatestTitle}>Seneste</h3>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className={styles.uploadButtons}>
              <label>
                <FontAwesomeIcon icon={faImages} size="2x" />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </label>
              <label>
                <FontAwesomeIcon icon={faCamera} size="2x" />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {showGallery && (
            <div className={styles.lastestUploadedPics}>
              {gallery.length > 0 ? (
                gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className={styles.imageHoler}
                    style={{
                      backgroundImage: `url(${url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSelectGallery(url)}
                  />
                ))
              ) : (
                <p>No images found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
