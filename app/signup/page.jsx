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
            Vælg din rolle for at tilmelde dig Tantakuy og deltage i spændende konkurrencer
          </p>

          <div className={styles.card}>
            <RoleSelector onSend={handleButtonVibility} />
          </div>
          {buttonSignup && <button className={styles.button}>Tilmeld dig →</button>}
        </div>
      </main>
    </>
  );
}
