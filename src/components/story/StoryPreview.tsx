'use client';
 
 import React, { useState, useEffect } from "react";
 import Image from "next/image";
 import styles from "./StoryPreview.module.scss"; 
 
 interface StoryPreviewProps {
     parts: { illustration: string; text: string }[];
     isOpen: boolean;
     onClose: () => void;
 }
 
 const StoryPreview: React.FC<StoryPreviewProps> = ({ parts, isOpen, onClose }) => {
     const [currentIndex, setCurrentIndex] = useState(0);
 
     useEffect(() => {
         if (!isOpen) {
             setCurrentIndex(0);
         }
     }, [isOpen]);
 
     if (!isOpen) return null;
 
     const handleNext = () => {
         if (currentIndex < parts.length - 1) {
             setCurrentIndex(currentIndex + 1);
         } else {
             onClose(); 
         }
     };
 
     const handlePrev = () => {
         if (currentIndex > 0) {
             setCurrentIndex(currentIndex - 1);
         }
     };
 
     return (
         <div className={styles.overlay}>
             <div className={styles.content}>
                 <div className={styles.left}>
                     <Image
                         src={parts[currentIndex]?.illustration || "/placeholder-image.jpg"}
                         alt={`تصویر ${currentIndex + 1}`}
                         width={600}
                         height={400}
                         className={styles.image}
                     />
                 </div>
                 <div className={styles.right}>
                     <p className={styles.text}>{parts[currentIndex]?.text || "متنی وارد نشده است."}</p>
                     <div className={styles.buttonContainer}>
                         <button 
                             className={styles.prevButton} 
                             onClick={handlePrev} 
                             disabled={currentIndex === 0}
                         >
                             قبلی
                         </button>
                         <button className={styles.nextButton} onClick={handleNext}>
                             {currentIndex === parts.length - 1 ? "بستن" : "بعدی"}
                         </button>
                     </div>
                 </div>
             </div>
         </div>
     );
 };
 
 export default StoryPreview;