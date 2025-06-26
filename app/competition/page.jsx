
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalSuccess from '../components/modals/successCreationModal';
import styles from "../competition/competition.module.css"


export default function competition() {
  const [isOpen, setIsOpen] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsOpen(true)
    
  };

  return (<div>


    <button className={styles.submitButton} onSubmit={handleSubmit} onClick={(()=> setIsOpen(true))} >Submit</button>
    <ModalSuccess isOpen={isOpen} onClose={(()=> setIsOpen(false))}>

    </ModalSuccess>

  </div>)

}