import styles from './CompetitionItem.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import { FaTrashAlt } from 'react-icons/fa';

export default function CompetitionItem({
  id,
  title,
  companyName,
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
      {/* header + body */}
      <div className={styles.infoLeft}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <span className={styles.separator}> - </span>
          <span className={styles.companyName}>{companyName}</span>
        </div>
        <div className={styles.body}>
          <Link href={`/entry/${id}`}>
            <Image
              src={imageUrl}
              alt="Dit indlæg"
              width={93}
              height={57}
              className={styles.userImage}
            />
          </Link>
          <div className={styles.stats}>
            <span className={`${styles.statItem} ${styles.like}`}>
              {likes} Synes godt om
            </span>
            {shares !== undefined && (
              <span className={`${styles.statItem} ${styles.share}`}>
                {shares} Delinger
              </span>
            )}
            <span className={`${styles.statItem} ${styles.save}`}>
              {saved} Gemt
            </span>
          </div>
        </div>
      </div>

      {/* vertically‐centered delete */}
      <div className={styles.deleteBtnContainer}>
        <button
          className={`${styles.button} ${styles.deleteBtn}`}
          onClick={handleDelete}
        >
          <FaTrashAlt style={{ marginRight: '4px' }} />
        </button>
      </div>
    </div>
  );
}
