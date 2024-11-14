// src/Home.tsx
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import Settings from '../menu/Settings';
import UserMenu from '../menu/UserMenu';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();

const elements = [textToken.getToken('settings'),textToken.getToken('menu')]

const ImageResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState(elements[0]);
  const navigate = useNavigate();

  const handleSlideChange = (swiper) => {
    const { activeIndex } = swiper
    console.log('Active Slide Index:', activeIndex);
    setTitle(elements[activeIndex])
    // if (swiper.activeIndex === 0) {
    //     window.location.href = `/result/000`;
    // }
    // // Navigate to the new URL as a fresh page if the last slide is reached
    // if (swiper.activeIndex === 2) {
    //     window.location.href = `/result/999`;
    // }
  };

  const btnClick = () => {
    console.log('click')
    setShowDialog(true)
  }

  const closeElement = () => navigate('/'); 

  return (
    <>
      <div className="app-container">
        <header className="header menu">
          <div className='header-middle'>{title}</div>
          <div onClick={() => closeElement()}>{textToken.getToken('close')}</div>
        </header>
        <main className="content">
          <Swiper spaceBetween={50} 
            slidesPerView={1}
            initialSlide={0}
            onSlideChange={handleSlideChange}>
            <SwiperSlide key={0}>{Settings}</SwiperSlide>
            <SwiperSlide key={1}>{UserMenu}</SwiperSlide>
          </Swiper>
        </main>
      {/* <OverlayDialog 
      isOpen={showDialog}
      onClose={() => setShowDialog(false)}
      /> */}
        <footer className="footer">Footer</footer>
      </div>
    </>
  );
};

export default ImageResult;

