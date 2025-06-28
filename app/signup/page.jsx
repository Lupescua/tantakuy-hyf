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
          <p className={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in magna
            lacus.
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
