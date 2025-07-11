import styles from './CompetitionItem.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';

export default function CompetitionItem({
  id,
  title,
  organizer,
  likes,
  shares,
  saved,
  imageUrl,
  onDelete,
}) {
  const router = useRouter();

  // Delete this entry
  const handleDelete = async (e) => {
    e.preventDefault(); // don’t follow the link
    console.log('Deleting entry with id:', id);
    if (!confirm('Er du sikker på, at du vil slette dit indlæg?')) return;
    try {
      await API.delete(`/entries/${id}`);
      onDelete?.(id); // re‐fetch the parent page data
    } catch (err) {
      console.error('Sletning mislykkedes:', err);
      alert('Kunne ikke slette indlægget. Prøv igen.');
    }
  };
  return (
    <div className={styles.competitionItem}>
      <div className={styles.infoLeft}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <span className={styles.separator}> - </span>
          <span className={styles.organizer}>{organizer}</span>
        </div>
        <Image
          src={imageUrl}
          alt="Your submission"
          width={93}
          height={57}
          className={styles.userImage}
        />
      </div>
      <div className={styles.stats}>
        <span className={`${styles.statItem} ${styles.like}`}>
          {likes} Likes
        </span>
        {shares !== undefined && (
          <span className={`${styles.statItem} ${styles.share}`}>
            {shares} Shares
          </span>
        )}
        <span className={`${styles.statItem} ${styles.save}`}>
          {saved} Saved
        </span>
      </div>
      {/* Delete‐button */}
      <button
        className={`${styles.statItem} ${styles.deleteBtn}`}
        onClick={handleDelete}
      >
        Slet
      </button>
    </div>
  );
}
