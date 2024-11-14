// src/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import Settings from '../menu/Settings';
import UserMenu from '../menu/UserMenu';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import useScrollListener from '../tools/useScrollListener';
import { SVG } from '../svg/default'; const svgInst = new SVG();
const elements = [textToken.getToken('settings'),textToken.getToken('menu')];
import OpacityHeader from '../elements/OpacityHeader';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Settings');
  const [loaded, setLoaded] = useState(true);
  const { scrollRef, isAtTop } = useScrollListener();
  
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

  useEffect(() => {
        console.log(isAtTop)
  }, [isAtTop]);

  const closeElement = () => navigate('/');

  return (
    <>
      <OpacityHeader isAtTop={isAtTop} title={title} closeElement={closeElement}/>
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
      {/* <OverlayDialog 
      isOpen={showDialog}
      sha={inputSha}
      entryValue={inputValue}
      onClose={() => {
        setShowDialog(false)
        setDialogChanged(true)
      }
      }
      /> */}
      <footer className="footer"></footer>
      </div>
    </>
  );
};




  // return (
  //   <>
  //     <div className="app-container">
  //       <header className="header menu">
  //         <div className='header-middle'>{title}</div>
  //         <div onClick={() => closeElement()}>{textToken.getToken('close')}</div>
  //       </header>
  //       <main className="content">
  //         <Swiper spaceBetween={50} 
  //           slidesPerView={1}
  //           initialSlide={0}
  //           onSlideChange={handleSlideChange}>
  //           <SwiperSlide key={0}>{Settings}</SwiperSlide>
  //           <SwiperSlide key={1}>{UserMenu}</SwiperSlide>
  //         </Swiper>
  //       </main>
  //     {/* <OverlayDialog 
  //     isOpen={showDialog}
  //     onClose={() => setShowDialog(false)}
  //     /> */}
  //       <footer className="footer">Footer</footer>
  //     </div>
  //   </>
  // );


export default Menu;

