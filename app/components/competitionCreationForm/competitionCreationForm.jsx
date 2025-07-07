'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './competitionForm.css';
import NavbarLoggedIn from '../layouts/NavbarLoggedIn/NavbarLoggedIn';

function CompetitionForm() {
  const [title, setTitle] = useState('');
  const [prize, setPrize] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizeDate, setPrizeDate] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);

  const router = useRouter();

  const handlePhotoUpload = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('prize', prize);
    formData.append('endDate', endDate);
    formData.append('prizeDate', prizeDate);
    formData.append('description', description);
    formData.append('terms', terms);
    formData.append('fileTitle', fileTitle);

    if (file) formData.append('file', file);
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    try {
      const res = await fetch('/api/competitions', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/competition`);
      } else {
        alert('Noget gik galt. Prøv igen.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Serverfejl. Prøv igen senere.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn"> × </button>
        <h2> Opret ny konkurrence</h2>

        <label>Titel:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Præmie:</label>
        <input
          type="text"
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
        />

        <label>Dato for slut:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>Dato for udvælgelse af vinder:</label>
        <input
          type="date"
          value={prizeDate}
          onChange={(e) => setPrizeDate(e.target.value)}
        />

        <label>Beskrivelse:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Konkurrencevilkår:</label>
        <textarea value={terms} onChange={(e) => setTerms(e.target.value)} />

        <label>Tilføj billeder</label>
        <input type="file" multiple onChange={handlePhotoUpload} />

        <label>Tilføj fil (f.eks. katalog, shopping, andet)</label>
        <input type="file" onChange={handleFileUpload} />

        <label>Tilføj fil titel (f.eks. katalog, shopping, andet)</label>
        <input
          type="text"
          value={fileTitle}
          onChange={(e) => setFileTitle(e.target.value)}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          {' '}
          Opret konkurrence
        </button>
      </div>
    </div>
  );
}

export default CompetitionForm;
