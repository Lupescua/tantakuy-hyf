'use client';

import React, { useState } from 'react';
import styles from './CreateCompetitionForm.module.css';
import SuccessCreationModal from '@/app/components/modals/successCreationModal';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import API from '@/utils/axios';

export default function CreateCompetitionForm() {
  const router = useRouter();
  const { id: companyId } = useParams();
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // reset previous errors

    const form = e.target;

    // Convert dates from form inputs
    const start = new Date(form.startDate.value);
    const end = new Date(form.endDate.value);
    const winnerSelection = new Date(form.winnerSelectionDate.value);
    const participationDeadline = new Date(form.participationDeadline.value);
    const votingDeadline = new Date(form.votingDeadline.value);

    // Clear existing errors
    setErrorMsg('');

    // Validate date logic
    if (end <= start) {
      setErrorMsg('Slutdatoen skal være efter startdatoen.');
      return;
    }

    if (winnerSelection <= end) {
      setErrorMsg('Vinderudvælgelsesdatoen skal være efter slutdatoen.');
      return;
    }

    if (votingDeadline <= participationDeadline) {
      setErrorMsg('Afstemningsdatoen skal være efter deltagelsesfristen.');
      return;
    }

    setIsSubmitting(true);

    const imageFile = form.image.files[0];
    let imageUrl = '';

    try {
      // Upload image to S3
      if (imageFile) {
        const data = new FormData();
        data.append('image', imageFile);

        const uploadResp = await API.post('/upload', data);
        console.log('S3 upload result:', uploadResp.data);
        imageUrl = uploadResp.data.url;
      }

      // Prepare form data
      const formData = {
        title: form.title.value,
        description: form.description.value,
        competitionTerms: form.terms.value,
        prize: form.prize.value,
        startDate: form.startDate.value
          ? new Date(form.startDate.value).toISOString()
          : null,
        endDate: form.endDate.value
          ? new Date(form.endDate.value).toISOString()
          : null,
        participationDeadline: form.participationDeadline.value
          ? new Date(form.participationDeadline.value).toISOString()
          : null,
        votingDeadline: form.votingDeadline.value
          ? new Date(form.votingDeadline.value).toISOString()
          : null,
        winnerSelectionDate: form.winnerSelectionDate.value
          ? new Date(form.winnerSelectionDate.value).toISOString()
          : null,
        winnerAnnouncingDate: form.winnerAnnouncingDate.value
          ? new Date(form.winnerAnnouncingDate.value).toISOString()
          : null,
        image: imageUrl,
        website: form.website.value,
        facebook: form.facebook.value,
        instagram: form.instagram.value,
        linkedin: form.linkedin.value,
        company: companyId,
      };

      // I'm using axios instead of just fetch
      const res = await API.post('/competitions', formData);

      if (res.status === 201) {
        setShowSuccessModal(true);

        // Hide the modal after 5 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push(`/company/${companyId}/competitions`);
        }, 5000);
      } else {
        setErrorMsg(res.data?.error || 'Failed to create competition.');
        console.error('API error:', res.data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMsg(
        error.response?.data?.error || 'An unexpected error occurred.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  //the go back button was just decorative :D
  const goBack = () => {
    router.push(`/company/${companyId}/competitions`);
  };

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.pageWrapper}>
        <div className={styles.backButton}>
          <button onClick={goBack}>Back</button>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.formOverride}>
            {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
            <div className={styles.formInput}>
              <label> Konkurrence Titel </label>
              <input type="text" name="title" required />
            </div>

            <div className={styles.formInput}>
              <label> Tilføj billede </label>
              <label className={styles.uploadBox}>
                +
                <input type="file" name="image" style={{ display: 'none' }} />
              </label>
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.formInput}>
                <label> Konkurrence startdato </label>
                <input type="date" name="startDate" required />
              </div>
              <div className={styles.formInput}>
                <label>Konkurrence slutDato </label>
                <input type="date" name="endDate" required />
              </div>
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.formInput}>
                <label> Deadline for deltagelse </label>
                <input type="date" name="participationDeadline" required />
              </div>
              <div className={styles.formInput}>
                <label> Deadline for afstemning </label>
                <input type="date" name="votingDeadline" required />
              </div>
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.formInput}>
                <label> Dato vinderudvælgelse </label>
                <input type="date" name="winnerSelectionDate" required />
              </div>
              <div className={styles.formInput}>
                <label> Dato vinderannoncering </label>
                <input type="date" name="winnerAnnouncingDate" />
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
          {showSuccessModal && (
            <SuccessCreationModal
              isOpen={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
