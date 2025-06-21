'use client';
import styles from '../../../style/forms.module.css';



import { useState } from 'react';
import ParticpantForm from "./ParticipantForm"
import CompanyForm from "./CompanyForm"
import OrganizationForm from './OrganizationForm';

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleBack = () => {
    setSelectedRole(null);
  };

  return (
    <div className="signup-container">
      {!selectedRole && (
        <div className="card">
          <button className={styles.buttonWhite} onClick={() => setSelectedRole('user')}>User</button>
          <button className={styles.buttonWhite} onClick={() => setSelectedRole('company')}>Company</button>
          <button className={styles.buttonWhite} onClick={() => setSelectedRole('organization')}>Organization</button>
        </div>
      )}

      {selectedRole === 'user' && (
        <div>
          <button onClick={handleBack}>← Back</button>
          <h2>Get started</h2>
          <p>Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in magna lacus.</p>
          <ParticpantForm></ParticpantForm>
        </div>
      )}

      {selectedRole === 'company' && (
        <div>
          <button onClick={handleBack}>← Back</button>
          <h2>Company Signup Form</h2>
          <CompanyForm></CompanyForm>
        </div>
      )}

      {selectedRole === 'organization' && (
        <div>
          <button onClick={handleBack}>← Back</button>
          <h2>Organization Signup Form</h2>
          <OrganizationForm></OrganizationForm>
        </div>
      )}
    </div>
  );
}