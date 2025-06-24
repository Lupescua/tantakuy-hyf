
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalSuccess from '../modals/successCreationModal';


export default function competition() {
  const [isOpen, setIsOpen] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsOpen(true)
    
  };

  return (<div>


    <button onSubmit={handleSubmit}>Submit</button>
    <ModalSuccess isOpen={isOpen} onClose={(()=> setIsOpen(false))}>
    <h2>Modal Title</h2>
    <p>This is a reusable modal component.</p>
    </ModalSuccess>

  </div>)

}