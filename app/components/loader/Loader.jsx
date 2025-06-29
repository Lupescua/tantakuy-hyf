import styles from './Loader.module.css';


export default function Loader() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.dots}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
      <p className={styles.loadingText}>Please wait...</p>
    </div>
  );
}
