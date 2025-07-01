
import React, { useState } from 'react';
import './CompetitionForm.css';
import NavbarLoggedIn from '../layouts/NavbarLoggedIn/NavbarLoggedIn';

function CompetitionForm() {
  const [title, setTitle] = useState('');
  const [prize, setPrize] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizeDate, setprizeDate] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [fileTitle, setFileTitle] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn"> × </button>
        <h2> Opret ny konkurrence</h2>
        
        <label>Titel:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />

        <label>Præmie:</label>
        <input type="text" value={prize} onChange={e => setPrize(e.target.value)} />

        <label>Dato for slut:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

        <label>Dato for udvælgelse af vinder:</label>
        <input type="date" value={selectionDate} onChange={e => setprizeDate(e.target.value)} />

        <label>Beskrivelse:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />

        <label>Konkurrencevilkår:</label>
        <textarea value={terms} onChange={e => setTerms(e.target.value)} />

        <label>Tilføj billeder</label>
        <div className="upload-box">Add photos<br /><small>Or drag and drop</small></div>

        <label>Tilføj fil (f.eks. katalog, shopping, andet)</label>
        <div className="upload-box">Add file<br /><small>Or drag and drop</small></div>

        <label>Tilføj fil titel (f.eks. katalog, shopping, andet)</label>
        <input type="text" value={fileTitle} onChange={e => setFileTitle(e.target.value)} />

        <button className="submit-btn">Opret konkurrence</button>
      </div>
    </div>
  );
}

export default CompetitionForm;
