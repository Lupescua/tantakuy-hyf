import React, { useState } from 'react';
import './CompetitionForm.css';
import  Success from './app/layout.js';
import NavbarLoggedIn from 'app/components/layouts/NavbarLoggedIn';
import Footer from 'app/components/layouts/FooterLoggedIn';

function CompetitionForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: null,
    startDate: '',
    endDate: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'banner') {
      setFormData({ ...formData, banner: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('conditions', formData.conditions);
    form.append('prize', formData.prize);
    form.append('banner', formData.banner);
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);

        try {
            const response = await fetch('/api/competitions', {
              method: 'POST',
              body: form,
              credentials: 'include'
            });
      
            if (response.ok) {
              
              router.push('/success'); 
            } else {
              setMessage('Submission failed.');
            }
          } catch (error) {
            console.error(error);
            setMessage('An error occurred.');
          }
        } ;

  return (
    <div className="competition-form-modal">
      <form className="competition-form" onSubmit={handleSubmit}>
        <h2>Opret ny konkurrence </h2>

        <label> Titel :</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
  <label>Præmie :</label>
        <textarea
          name="prize"
          value={formData.prize}
          onChange={handleChange}
          required
        ></textarea>

         <label>  Billede :</label>
        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <label> Beskrivelse: </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

<label> Konkurrencevilkår: </label>
        <textarea
          name="conditions"
          value={formData.conditions}
          onChange={handleChange}
          required
        ></textarea>

       
        <label> Dato for slut :  </label>
        <input
          type="date"
          name="endDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <label> Dato for udvægelse af vinder : </label>
        <input
          type="date"
          name="prizeDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />

        <button type="submit"> Bekræft </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}

export default CompetitionForm;
