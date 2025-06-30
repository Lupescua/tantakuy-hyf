'use client';
import React, { useState } from 'react';
import axios from 'axios';
import './entry-form.css';
// import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
const EntryForm = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !text.trim()) {
      setError('Både billede og tekst er påkrævet');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('text', text);

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Uploadet!');
      setImage(null);
      setText('');
      setPreview(null);
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
          {/* <CloseIcon className="closeicon" /> */}
          <FontAwesomeIcon icon={faXmark} className="closeicon" />
        </div>
        <span className="uploadtitle">Valgte billeder</span>
        {/* <button className="nextbtn" onClick={handleNext}>
          Next
        </button> */}
        <Link className="nextbtn" href={'/competition-overview'}>
          Next
        </Link>
      </div>

      <form className="entryform" onSubmit={handleSubmit}>
        {preview ? (
          <img src={preview} alt="Preview" className="previewimage" />
        ) : (
          <div className="placeholderimage">
            <img
              src="/default-image.png"
              alt="Placeholder"
              className="placeholderimage"
            />
          </div>
        )}

        <label htmlFor="text" className="textlabel">
          Tilføj tekst
        </label>
        <textarea
          id="text"
          className="entrytextarea"
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
