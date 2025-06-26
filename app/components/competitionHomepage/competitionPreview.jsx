import React from "react";
import "./CompetitionPreview.css";

const CompetitionPreview = ({ competition }) => {
  const { name, logoUrl, entries = [] } = competition;

  const maxEntries = 6;
  const entryImages =
    entries.length > 0 ? [...entries] : Array(maxEntries).fill(null);

  while (entryImages.length < maxEntries) {
    entryImages.push(null);
  }

  return (
    <div className="competition-preview-card">
      <div className="competition-header">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Company Logo"
            className="competition-logo"
          />
        )}
        <h2 className="competition-title">{name}</h2>
      </div>
      <div className="competition-grid">
        {entryImages.map((entry, index) => (
          <div key={index} className="competition-entry">
            {entry && entry.imageUrl ? (
              <img
                src={entry.imageUrl}
                alt={`Entry ${index + 1}`}
                className="entry-image"
              />
            ) : (
              <div className="entry-placeholder" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitionPreview;

