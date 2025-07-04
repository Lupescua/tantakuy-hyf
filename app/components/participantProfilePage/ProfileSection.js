import styles from './ProfileSection.module.css';

export default function ProfileSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Peter Plys</h2>
        <div className={styles.avatar}>PP</div>

        <p className={styles.region}>Midtjylland</p>
      </div>
      <div className={styles.about}>
        <h3>About:</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          commodo ligula eget dolor...
        </p>
      </div>
      <div className={styles.competitions}>
        <h3>Konkurrencer deltaget i</h3>
      </div>
    </div>
  );
}
