'use client';

import React, { useState } from 'react';
import styles from './competitionForm.module.css';
import { useRouter } from 'next/navigation';

const CompetitionForm = () => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const formData = {
      title: form.title.value,
      description: form.description.value,
      competitionTerms: form.terms.value,
      endDate: new Date(form.endDate.value).toISOString(),
      winnerSelectionDate: form.winnerSelectionDate.value
        ? new Date(form.winnerSelectionDate.value).toISOString()
        : null,
      company: '6867f128b3b1d5c9f87baa98', // The company id is hardcoded for now
    };

    try {
      const res = await fetch('/api/competitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/app/modals/successCreationModal');
      } else {
        const errorData = await res.json();
        alert(`Failed to create competition: ${errorData.error}`);
        console.error('API error:', errorData);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.pageWrapper}>
        <div className={styles.backButton}>
          <button>Back</button>
        </div>

        <div className={styles.formContainer}>
        
          <form onSubmit={handleSubmit} className={styles.formOverride}>
            <div className={styles.formInput}>
              <label> Konkurrence Titel </label>
              <input type="text" name="title" required />
            </div>

            <div className={styles.formInput}>
              <label> Tilføj billede </label>
              <label className={styles.uploadBox}>
                +
                <input
                  type="file"
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.formInput}>
                <label> Konkurrence startdato </label>
                <input type="date" name="startDate"  />
              </div>
              <div className={styles.formInput}>
                <label>Konkurrence slutDato </label>
                <input type="date" name="endDate" required />
              </div>
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.formInput}>
                <label> Deadline for deltagelse </label>
                <input type="date" name="participationDeadline"  />
              </div>
              <div className={styles.formInput}>
                <label> Deadline for afstemning </label>
                <input type="date" name="votingDeadline" />
              </div>
            </div>

             <div className={styles.gridTwo}>
              <div className={styles.formInput}>
                <label> Dato vinderudvælgelse </label>
                <input type="date" name="winnerSelectionDate" required />
              </div>
              <div className={styles.formInput}>
                <label> Dato vinderannoncering </label>
                <input type="date" name="winnerAnnouncingDate"  />
              </div>
            </div>

            <div className={styles.formInput}>
              <label> Konkurrence Beskrivelse </label>
              <textarea name="description" rows="4" />
            </div>

            <div className={styles.formInput}>
              <label>Præmie </label>
              <input type="text" name="prize" />
            </div>

            <div className={styles.formInput}>
              <label> Vikår </label>
              <textarea name="terms" rows="4" />
            </div>

            <div className={styles.socialRow}>
              <div className={styles.formInput}>
                <label> Hjemmeside </label>
                <input type="text" name="website" />
              </div>
              <div className={styles.formInput}>
                <label> Facebook </label>
                <input type="text" name="facebook" />
              </div>
              <div className={styles.formInput}>
                <label>Instagram</label>
                <input type="text" name="instagram" />
              </div>
              <div className={styles.formInput}>
                <label>LinkedIn</label>
                <input type="text" name="linkedin" />
              </div>
            </div>

            <div className={styles.formInput}>
              <button type="submit"> Opret </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompetitionForm;
