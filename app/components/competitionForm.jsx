'use client';
import React, { useState } from 'react';
import './competitionForm.css';
import { useRouter } from 'next/navigation';

const CompetitionForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    deadlineParticipation: '',
    deadlineVoting: '',
    winnerSelectionDate: '',
    winnerAnnouncementDate: '',
    description: '',
    prize: '',
    terms: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const isValidURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};
    const {
      title,
      startDate,
      endDate,
      deadlineParticipation,
      deadlineVoting,
      winnerSelectionDate,
      winnerAnnouncementDate,
      prize,
      facebook,
      instagram,
      linkedin,
      website,
    } = formData;

    if (!title) newErrors.title = 'Title is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (!deadlineParticipation) newErrors.deadlineParticipation = 'Participation deadline is required';
    if (!deadlineVoting) newErrors.deadlineVoting = 'Voting deadline is required';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const part = new Date(deadlineParticipation);
    const vote = new Date(deadlineVoting);
    const select = winnerSelectionDate ? new Date(winnerSelectionDate) : null;
    const announce = winnerAnnouncementDate ? new Date(winnerAnnouncementDate) : null;

    if (start && end && start >= end) newErrors.endDate = 'End date must be after start date';
    if (end && part && end >= part) newErrors.deadlineParticipation = 'Participation deadline must be after end date';
    if (part && vote && part >= vote) newErrors.deadlineVoting = 'Voting deadline must be after participation deadline';
    if (select && vote && vote >= select) newErrors.winnerSelectionDate = 'Winner selection must be after voting deadline';
    if (select && announce && select >= announce) newErrors.winnerAnnouncementDate = 'Announcement must be after winner selection';

    ['facebook', 'instagram', 'linkedin', 'website'].forEach((field) => {
      if (formData[field] && !isValidURL(formData[field])) {
        newErrors[field] = 'Invalid URL';
      }
    });

    if (prize && prize.length > 100) {
      newErrors.prize = 'Prize must be under 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
  };

  return (
    <div className="formContainer">
      <div className="formHeader">
        <h2>Create Competition</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="formInput">
          <label>Competition Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div className="formInput">
          <label>Upload Competition Image</label>
          <label className="uploadBox">
            +
            <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        </div>

        <div className="gridTwo">
          <div className="formInput">
            <label>Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            {errors.startDate && <p className="error">{errors.startDate}</p>}
          </div>
          <div className="formInput">
            <label>End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            {errors.endDate && <p className="error">{errors.endDate}</p>}
          </div>
        </div>

        <div className="gridTwo">
          <div className="formInput">
            <label>Deadline for Participation</label>
            <input type="date" name="deadlineParticipation" value={formData.deadlineParticipation} onChange={handleChange} />
            {errors.deadlineParticipation && <p className="error">{errors.deadlineParticipation}</p>}
          </div>
          <div className="formInput">
            <label>Deadline for Voting</label>
            <input type="date" name="deadlineVoting" value={formData.deadlineVoting} onChange={handleChange} />
            {errors.deadlineVoting && <p className="error">{errors.deadlineVoting}</p>}
          </div>
        </div>

        <div className="gridTwo">
          <div className="formInput">
            <label>Winner Selection Date</label>
            <input type="date" name="winnerSelectionDate" value={formData.winnerSelectionDate} onChange={handleChange} />
            {errors.winnerSelectionDate && <p className="error">{errors.winnerSelectionDate}</p>}
          </div>
          <div className="formInput">
            <label>Winner Announcement Date</label>
            <input type="date" name="winnerAnnouncementDate" value={formData.winnerAnnouncementDate} onChange={handleChange} />
            {errors.winnerAnnouncementDate && <p className="error">{errors.winnerAnnouncementDate}</p>}
          </div>
        </div>

        <div className="formInput">
          <label>Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
        </div>

        <div className="formInput">
          <label>Prize</label>
          <input type="text" name="prize" value={formData.prize} onChange={handleChange} />
          {errors.prize && <p className="error">{errors.prize}</p>}
        </div>

        <div className="formInput">
          <label>Competition Terms</label>
          <textarea name="terms" rows="4" value={formData.terms} onChange={handleChange} />
        </div>

        <div className="socialRow">
          {['website', 'facebook', 'instagram', 'linkedin'].map((field) => (
            <div className="formInput" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type="text" name={field} value={formData[field]} onChange={handleChange} />
              {errors[field] && <p className="error">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div className="formInput">
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default CompetitionForm;
