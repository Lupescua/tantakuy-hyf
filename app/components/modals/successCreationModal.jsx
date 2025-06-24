'use client';

import React from 'react';
import style from "@/style/successCreationModel.module.css"
import { useState, useEffect } from 'react';
export default function ModalSuccess({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer); 
    }else{
      onClose();
    }
  }, [counter, onClose]);


  return (
    <div className={style.modelContainer}>
      <div className="">
        <h1 className={style.modalTitle}>Konkurrence Oprettet</h1>
        <button
          onClick={onClose}
          className={style.modalCloseBtn}
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div className={style.modalIconsContainer}>
          <span className={style.modalCheckIcon}><i class="fa-solid fa-circle-check"></i></span>
          <svg
          className={style.modalSvg}
            width="150"
            height="100"
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 50 Q 40 10, 70 30 T 100 20"
              stroke="#FFA500"
              stroke-width="3"
              fill="none"
              stroke-dasharray="200"
              stroke-dashoffset="200"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="200"
                to="0"
                dur="1s"
                fill="freeze"
                repeatCount="1"
              />
            </path>
          </svg>
          <svg
          className={style.modalSvg2}
            width="50"
            height="100"
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 50 Q 50 120, 90 100 T -90 100"
              stroke="#008000"
              stroke-width="3"
              fill="none"
              stroke-dasharray="200"
              stroke-dashoffset="200"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="200"
                to="0"
                dur="1s"
                fill="freeze"
                repeatCount="1"
              />
            </path>
          </svg>
          <svg
          className={style.modalSvg3}
            width="50"
            height="100"
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 50 Q 50 120, 90 100 T 90 100"
              stroke="#FFA07A"
              stroke-width="3"
              fill="none"
              stroke-dasharray="200"
              stroke-dashoffset="200"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="200"
                to="0"
                dur="1s"
                fill="freeze"
                repeatCount="1"
              />
            </path>
          </svg>
          <div className={style.redCircle}></div>
          <div className={style.greenDarkCircle}></div>
          <div className={style.greenDarkSmallircle}></div>
          <div className={style.greenLightCircle}></div>
          <div className={style.orangeEmptyCircle}></div>
          <div className={style.greenEmptyDarkCircle}></div>
          <div className={style.greenEmptyLightCircle}></div>

        </div>
        
      </div>
      <div className={style.backIn}>Close in {counter}</div>
    </div>
  );
}