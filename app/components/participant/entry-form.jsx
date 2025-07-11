'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import UploadImageModal from '../modals/uploadImageModal';
import API from '@/utils/axios';
import Loader from '../loader/Loader';

import './entry-form.css';

/**
 * Props
 * -----
 * @param {string} userId         Mongo ObjectId of the current participant
 * @param {string} competitionId  Mongo ObjectId of the current competition
 */
export default function EntryForm({ userId, competitionId }) {
  const router = useRouter();

  /* ───────── state ───────── */
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState(null); // final Cloudinary URL
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ─── Handlers for the generic modal ─────────────────
  const uploadHandler = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const resp = await API.post('/upload', formData);
    // our /api/upload returns { url }
    return resp.data.url;
  };

  const fetchHandler = async () => {
    const resp = await API.get('/entries/get-entries-images', {
      params: { userId },
    });
    if (resp.data.success) {
      // expect an array of { imageUrl: string, … }
      return resp.data.data;
    }
    throw new Error('Kunne ikke hente tidligere billeder');
  };

  /* ───────── callback from modal ───────── */
  const handleImageUpload = (url) => {
    setImageUrl(url); // save URL we get from Cloudinary
    setModalOpen(false); // close modal
  };

  /* ───────── submit ───────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!imageUrl) return setError('Vælg et billede først');
    if (!competitionId) {
      setError('Mangler konkurrence-id');
      return;
    }
    console.log('🛰️ POST payload:', {
      imageUrl,
      caption,
      competition: competitionId,
    });

    try {
      setLoading(true);
      const resp = await API.post('/entries/create-new-entry', {
        imageUrl,
        caption,
        competition: competitionId,
      });
      console.log('🛠️ POST /entries response:', resp.data);
      const { data } = resp;

      if (data.success) {
        router.push(`/entry/${data.entryId}`);
      } else {
        setError(data.error || 'Kunne ikke gemme indlægget');
      }
    } catch (err) {
      console.error('🔥 create-new-entry failed:', err.response?.data || err);
      setError(err.response?.data?.error ?? 'Serverfejl – prøv igen');
    } finally {
      setLoading(false);
    }
  };

  /* ───────── UI ───────── */
  return (
    <div className="entrycontainer">
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="entryheader">
        <div className="entrytitle">Igangværende konkurrence</div>
      </header>

      <div className="uploadbar">
        <Link href={`/competitions/${competitionId}`}>
          <div className="closecircle">
            <FontAwesomeIcon icon={faXmark} className="closeicon" />
          </div>
        </Link>

        <span className="uploadtitle">Valgte billede</span>
        <Link className="nextbtn" href={`/competitions/${competitionId}`}>
          Tilbage
        </Link>
      </div>

      {/* ── FORM ───────────────────────────────────────────── */}
      <form className="entryform" onSubmit={handleSubmit}>
        {/* IMAGE PICKER / PLACEHOLDER */}
        <div
          className="placeholderimage"
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          <UploadImageModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onImageUpload={handleImageUpload}
            uploadHandler={uploadHandler}
            // we don’t save here—that happens on form submit—so omit saveHandler
            fetchHandler={fetchHandler}
            /* leave title & showGallery at their defaults */
          />

          <img
            src={imageUrl || '/default-image.png'}
            alt="Klik for at vælge billede"
            className="placeholderimage"
          />
        </div>

        {/* CAPTION */}
        <label htmlFor="caption" className="textlabel">
          Tilføj tekst
        </label>
        <textarea
          id="caption"
          className="entrytextarea"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Tekst"
        />

        {/* ERROR FEEDBACK */}
        {error && <p className="errormessage">{error}</p>}

        {/* SUBMIT */}
        <button type="submit" className="submitbtn" disabled={loading}>
          {loading ? <Loader /> : 'Del'}
        </button>
      </form>
    </div>
  );
}
