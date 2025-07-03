'use client';
import styles from './UploadImageModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCamera,
  faForward,
  faCircleXmark,
  faImage,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageTemplate from '../image-container-template/ImageTemplate';
import API from '@/utils/axios';

export default function UploadImageModal({
  isOpen,
  onClose,
  onImageUpload,
  uId,
}) {
  const userId = uId;

  const CLOUD_NAME = 'dahasdpeh';
  const UPLOAD_PRESET = 'l3sypto1';

  const [imageUrl, setImageUrl] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null); // NEW

  // const imageArr = Array.from({ length: 12 }, (_, i) => i);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();
    return data.secure_url;
  };
  const handleSelectImage = (url) => {
    setSelectedImageUrl(url);
  };
  const getAllUserEntriesImages = async () => {
    try {
      const response = await API.get(`/entries/get-entries-images/`, {
        params: { userId },
      });

      if (response.data.success) {
        console.log(response.data.data);
        setUserImages(response.data.data);
      } else {
        console.error('Failed to fetch entries:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user entries:', error);
    }
  };

  useEffect(() => {
    getAllUserEntriesImages();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadToCloudinary(file);
      setImageUrl(uploadedUrl);
      console.log('Uploaded:', uploadedUrl);
      if (onImageUpload && uploadedUrl) {
        onImageUpload(uploadedUrl);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleBar}>
          <button onClick={onClose} className={styles.closeButton}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
          <h2 className={styles.barTitle}>Upload dit billede</h2>
          {/* {imageUrl && (
                        <Link className={styles.nextButton} href="/image-upload-info">
                            <FontAwesomeIcon icon={faForward} />
                        </Link>
                    )} */}
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
                  onChange={handleUpload}
                />
              </label>
              <label>
                <FontAwesomeIcon icon={faCamera} size="2x" />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
              </label>
            </div>
          </div>

          <div className={styles.lastestUploadedPics}>
            {userImages.length > 0 ? (
              userImages.map((entry, index) => (
                <div
                  key={index}
                  className={styles.imageHoler}
                  style={{
                    backgroundImage: `url(${entry.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer', // show pointer to hint clickable
                  }}
                  onClick={() => handleSelectImage(entry.imageUrl)} // click handler here
                />
              ))
            ) : (
              <p>No images found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
