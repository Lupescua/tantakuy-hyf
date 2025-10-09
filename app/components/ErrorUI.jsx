'use client';

import Link from 'next/link';
import styles from '../error.module.css';

/**
 * Reusable error UI component for displaying error states
 * @param {Object} props
 * @param {string} props.title - The error title to display
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Callback function for retry button
 * @param {string} [props.homeHref='/'] - URL for the home/back button (defaults to '/')
 * @param {string} [props.homeText='Gå til forsiden'] - Text for the home/back button
 */
export default function ErrorUI({
  title,
  message,
  onRetry,
  homeHref = '/',
  homeText = 'Gå til forsiden',
}) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>{title}</h1>
        <p className={styles.errorMessage}>{message}</p>
        <div className={styles.errorActions}>
          <button onClick={onRetry} className={styles.retryButton}>
            Prøv igen
          </button>
          <Link href={homeHref} className={styles.homeButton}>
            {homeText}
          </Link>
        </div>
      </div>
    </div>
  );
}
