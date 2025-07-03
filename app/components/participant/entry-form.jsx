'use client';
import React, { useState } from 'react';
import './entry-form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import UploadImageModal from '../modals/uploadImageModal';
import API from '@/utils/axios';
const EntryForm = ({ userId, competitionId }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setImage(file);
  //   setPreview(URL.createObjectURL(file));
  // };
  const handleImageUpload = (url) => {
    setUploadedImageUrl(url);
    console.log('Received URL from modal:', url);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedImageUrl || !text.trim()) {
      setError('Både billede og tekst er påkrævet');
      return;
    }

    try {
      await API.post('/entries/create-new-entry/', {
        imageUrl: uploadedImageUrl,
        caption: text,
        participant: userId,
        competition: competitionId,
        description: ' ',
      });
      alert('Uploadet!');
      setImage(null);
      setText('');
      setPreview(null);
      setUploadedImageUrl(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Fejl under upload. Prøv igen.');
    }
  };
  return (
    <div className="entrycontainer">
      <header className="entryheader">
        <div className="entrytitle">Igangværende konkurrence</div>
      </header>
      <div className="uploadbar">
        <div className="closecircle">
          <FontAwesomeIcon icon={faXmark} className="closeicon" />
        </div>
        <span className="uploadtitle">Valgte billeder</span>
        <Link className="nextbtn" href={'/competitions'}>
          Next
        </Link>
      </div>

      <form className="entryform" onSubmit={handleSubmit}>
        <div className="placeholderimage" onClick={() => setModalOpen(true)}>
          <UploadImageModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onImageUpload={handleImageUpload}
            uId={userId}
          />
          <img
            src={preview || uploadedImageUrl || '/default-image.png'}
            alt="Preview or placeholder"
            className="placeholderimage"
          />
        </div>

        <label htmlFor="text" className="textlabel">
          Tilføj tekst
        </label>
        <textarea
          id="text"
          className="entrytextarea"
          style={{ color: 'white' }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tekst"
        />

        {error && <p className="errormessage">{error}</p>}

        <button type="submit" className="submitbtn">
          Del
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
