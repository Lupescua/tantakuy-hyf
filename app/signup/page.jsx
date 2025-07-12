'use client';
import { useState } from 'react';
import styles from './SignupPage.module.css';
import RoleSelector from '../components/signup/RoleSelector';

export default function SignupPage() {
  const [buttonSignup, setButtonSignUp] = useState(true);

  const handleButtonVibility = (data) => {
    setButtonSignUp(data);
  };

  return (
    <>
      <main className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Get started</h1>
          {/* TODO: Replace with Danish translation */}
          <p className={styles.subtitle}>
            {/* TODO: Replace with Danish translation */}
          </p>

          <div className={styles.card}>
            <RoleSelector onSend={handleButtonVibility} />
          </div>
          {buttonSignup && <button className={styles.button}>Sign up →</button>}
        </div>
      </main>
    </>
  );
}
