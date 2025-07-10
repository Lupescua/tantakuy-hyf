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
          <h1 className={styles.title}>Kom i gang</h1>
          <p className={styles.subtitle}>
            Opret en konto for at deltage i konkurrencer og udfordringer.
          </p>

          <div className={styles.card}>
            <RoleSelector onSend={handleButtonVibility} />
          </div>
          {buttonSignup && <button className={styles.button}>Opret bruger →</button>}
        </div>
      </main>
    </>
  );
}
