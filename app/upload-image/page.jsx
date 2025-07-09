'use client';

import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCamera,
  faForward,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { faImage, faImages } from '@fortawesome/free-regular-svg-icons';

import React, { useState } from 'react';
import Link from 'next/link';
import ImageTemplate from '../components/image-container-template/ImageTemplate';
import Loader from '../components/loader/Loader';
import API from '@/utils/axios';

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Loader />;
  }

  const uploadToS3 = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await API.post('/api/upload', formData);

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const uploadedUrl = await uploadToS3(file);
        setImageUrl(uploadedUrl);
        console.log('Uploaded:', uploadedUrl);
      } catch (err) {
        console.error(err);
        setLoading(false);
        alert('Could not upload image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const imageArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12];

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.titleBar}>
        <FontAwesomeIcon
          icon={faClose}
          size="sm"
          className={styles.closeIcon}
        />
        <h2 className={styles.barTitle}>Upload dit billede</h2>
        <Link className={styles.nextButton} href={'/image-upload-info'}>
          {imageUrl !== null && (
            <FontAwesomeIcon
              icon={faForward}
              size="2x"
              className={styles.nextIcon}
            />
          )}
        </Link>
      </div>

      <div
        className={styles.imageContainer}
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {imageUrl === null && (
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
            <Link href={'/'}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="5xs"
                className={styles.uploadImageRight}
              />
            </Link>
          </div>

          <div className={styles.uploadButtons}>
            <label className={styles.uploadImagesIcon}>
              <FontAwesomeIcon
                icon={faImages}
                size="2x"
                className={styles.uploadImagesIcon}
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </label>

            <label className={styles.uploaCamera}>
              <FontAwesomeIcon
                icon={faCamera}
                size="2x"
                className={styles.uploaCamera}
              />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className={styles.lastestUploadedPics}>
          {imageArr.slice(0, 12).map((image, index) => (
            <div key={`${index}+${index + 10}`} className={styles.imageHoler}>
              <ImageTemplate key={index} image={image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
