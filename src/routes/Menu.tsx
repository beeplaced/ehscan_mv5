// src/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import Settings from '../menu/Settings';
import UserMenu from '../menu/UserMenu';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import useScrollListener from '../tools/useScrollListener';
const elements = [textToken.getToken('settings'), textToken.getToken('account')];
const segments = ['settings','user'];
import OpacityHeader from '../elements/OpacityHeader';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Settings');
  const [segment, setSegment] = useState('settings');
  const [loaded] = useState(true);
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  
  const handleSlideChange = (swiper) => {
    const { activeIndex } = swiper
    setTitle(elements[activeIndex])
    setSegment(segments[activeIndex])
  };

  const closeElement = () => navigate(`/${localStorage.getItem('project')}`);

  return (
    <>
      <OpacityHeader isAtTop={isAtTop} title={title} closeElement={closeElement} segment={segment} />
      <div className="app-container-result result-page">
        <main ref={scrollRef} className={`content image-result ${loaded ? 'fade-in' : ''}`}>
          <Swiper spaceBetween={50} 
            slidesPerView={1}
            initialSlide={0}
            onSlideChange={handleSlideChange}>
            <SwiperSlide key={0}>{Settings}</SwiperSlide>
            <SwiperSlide key={1}>{UserMenu}</SwiperSlide>
          </Swiper>
        </main>
      <footer className="footer"></footer>
      </div>
    </>
  );
};

export default Menu;

