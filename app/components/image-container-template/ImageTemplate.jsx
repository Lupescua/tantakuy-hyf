import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import styles from '@/style/imageTemplate.module.css'
const ImageTemplate = (image) => {
    return (
        <div className={styles.imageContainer1}>
            <FontAwesomeIcon icon={faImage} size='1x' className={styles.imageIcon} />
        </div>
    )
}

export default ImageTemplate