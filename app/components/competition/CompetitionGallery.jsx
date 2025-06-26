import ImageCard from './ImageCard';
import styles from '../../competition-gallery/competition-gallery.module.css';

export default function CompetitionGallery() {
  const images = Array(30).fill('default-image.png');
  return (
    <>
      <div className={styles.gallery}>
        {images.map((imgUrl, index) => (
          <ImageCard key={index} imageUrl={imgUrl} />
        ))}
      </div>
    </>
  );
}
