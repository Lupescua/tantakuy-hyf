import styles from './SignupPage.module.css';
import RoleSelector from '../components/signup/RoleSelector';
export default function SignupPage() {
  return (
   <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Get started</h1>
        <p className={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur. Diam amet sed eget in magna lacus.
        </p>

        <div className={styles.card}> 
        <RoleSelector></RoleSelector>
      </div>
      <button className={styles.button}>Sign up →</button>
    </main>
  );
}
