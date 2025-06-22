'use client';

import { useState } from 'react';
import ParticpantForm from './ParticipantForm';
import CompanyForm from './CompanyForm';
import OrganizationForm from './OrganizationForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import styles from '../../../style/forms.module.css';
import { all } from 'axios';
export default function RoleSelector({ onSend }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [backButton, setBackButton] = useState(false);

  const handleBack = () => {
    setSelectedRole(null);
    onSend(true);
    setBackButton(false);
  };
  const handleUserChoise = (role) => {
    setSelectedRole(role);
    onSend(false);
    setBackButton(true);
  };

  return (
    <div className={styles.signupContainer}>
      {backButton && (
        <button onClick={handleBack} className={styles.itemButton}>
          {' '}
          <span className={styles.itemIcon}>
            {' '}
            <FontAwesomeIcon icon={faAngleLeft} />
          </span>
          Back
        </button>
      )}
      {!selectedRole && (
        <div className={styles.signupContainer}>
          <div
            className={styles.itemContainer}
            onClick={() => handleUserChoise('user')}
          >
            <p className={styles.signUpItems}>USER</p>
            <p className={styles.signUpItemsDescription}>
              Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in
              magna lacus.
            </p>
          </div>
          <div
            className={styles.itemContainer}
            onClick={() => handleUserChoise('company')}
          >
            <p className={styles.signUpItems}>COMPANY</p>
            <p className={styles.signUpItemsDescription}>
              Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in
              magna lacus.
            </p>
          </div>
          <div
            className={styles.itemContainer}
            onClick={() => handleUserChoise('organization')}
          >
            <p className={styles.signUpItems}>ORGANIZATION</p>
            <p className={styles.signUpItemsDescription}>
              Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in
              magna lacus.
            </p>
          </div>
        </div>
      )}

      {selectedRole === 'user' && (
        <div className={styles.signUpItem}>
          <ParticpantForm></ParticpantForm>
        </div>
      )}

      {selectedRole === 'company' && (
        <div className={styles.signUpItem}>
          {/* <h2>Company Signup Form</h2> */}
          <CompanyForm></CompanyForm>
        </div>
      )}

      {selectedRole === 'organization' && (
        <div className={styles.signUpItem}>
          {/* <h2>Organization Signup Form</h2> */}
          <OrganizationForm></OrganizationForm>
        </div>
      )}
    </div>
  );
}
