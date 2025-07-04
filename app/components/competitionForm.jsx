import React, { useState } from 'react';
import './CompetitionForm.css'; 
//import logo from './logo.png'; WE SHOULD REPLACE WITH FETCHING THE LOGO BUT IDK HOW 

import { useRouter } from 'next/router';

const CompetitionForm = () => {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/app/modals/successCreationModal'); 
  };
  return (
    <div className="backButton">
      <button>Back</button>

      <div className="formContainer">
        <img src={logo} alt="Logo" style={{ width: '30%', marginBottom: '10%', padding: '40%' }} />

        <form onSubmit={handleSubmit}>
          <div className="formInput">
            <label> Konkurrence Titel </label>
            <input type="text" name="title" required />
          </div>

          <div className="formInput">
            <label> Tilføj billede </label>
            <label className="uploadBox">
              +
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="gridTwo">
            <div className="formInput">
              <label> Start Dato </label>
              <input type="date" name="startDate" required />
            </div>
            <div className="formInput">
              <label>Slut  Dato </label>
              <input type="date" name="endDate" required />
            </div>
          </div>

          <div className="gridTwo">
            <div className="formInput">
              <label>  Deadline for deltagelse </label>
              <input type="date" name="participationDeadline" required />
            </div>
            <div className="formInput">
              <label>  Deadline for afstemning </label>
              <input type="date" name="votingDeadline" required />
            </div>
          </div>

          <div className="formInput">
            <label> Konkurrence Beskrivelse  </label>
            <textarea name="description" rows="4" />
          </div>

          <div className="formInput">
            <label>Præmie </label>
            <input type="text" name="prize" />
          </div>

          <div className="formInput">
            <label> Vikår </label>
            <textarea name="terms" rows="4" />
          </div>

          <div className="socialRow">
            <div className="formInput">
              <label> Hjemmeside </label>
              <input type="text" name="website" />
            </div>
            <div className="formInput">
              <label> Facebook </label>
              <input type="text" name="facebook" />
            </div>
            <div className="formInput">
              <label>Instagram</label>
              <input type="text" name="instagram" />
            </div>
            <div className="formInput">
              <label>LinkedIn</label>
              <input type="text" name="linkedin" />
            </div>
          </div>

          <div className="formInput">
            <button type="submit"> Opret </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetitionForm;
