'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalSuccess from '../modals/SuccessCreationModal';

export default function competition() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <div>
      <button onSubmit={handleSubmit}>Send</button>
      <ModalSuccess isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal titel</h2>
        <p>Dette er en genbrugelig modal komponent.</p>
      </ModalSuccess>
    </div>
  );
}
