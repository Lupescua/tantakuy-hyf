import styles from '../../competition-gallery/competition-gallery.module.css';


const ImageCard = ({imageUrl}) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt="Competition" className={styles.image} />

      <div className={styles.overlay}>
        <div className={styles.buttonGroup}>
          <div className={styles.button}>
            <span className={styles.icon}>♡</span>
            <span>Stem</span>
          </div>
          <div className={styles.button}>
            <span className={styles.icon}>⏴</span>
            <span>Del</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;