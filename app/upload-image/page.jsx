'use client';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCamera,
  faForward,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark, faClose } from '@fortawesome/free-solid-svg-icons';
import { faImage, faImages } from '@fortawesome/free-regular-svg-icons';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageTemplate from '../components/image-container-template/ImageTemplate';
import { CldImage } from 'next-cloudinary';

export default function UploadImage() {
  const CLOUD_NAME = 'dahasdpeh';
  const UPLOAD_PRESET = 'l3sypto1';

  const [imageUrl, setImageUrl] = useState(null);

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

  const handleComputerUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadToCloudinary(file);
      setImageUrl(uploadedUrl);
      console.log('Uploaded from computer:', uploadedUrl);
    }
  };

  const handleCameraUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadToCloudinary(file);
      setImageUrl(uploadedUrl);
      console.log('Uploaded from camera:', uploadedUrl);
    }
  };
  const handleImageChange = () => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
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
        onChange={handleImageChange}
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
              {' '}
              <FontAwesomeIcon
                icon={faChevronRight}
                size="5xs"
                className={styles.uploadImageRight}
              />{' '}
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
                onChange={handleComputerUpload}
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
                onChange={handleCameraUpload}
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
