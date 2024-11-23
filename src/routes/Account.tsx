// src/Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenLibrary from '../text/TokenLibrary'; const textToken = new TokenLibrary();
import useScrollListener from '../tools/useScrollListener';
const elements = [textToken.getToken('settings'), textToken.getToken('account')];
const segments = ['settings','user'];
import OpacityHeader from '../elements/OpacityHeader';
import UserMenu from '../menu/UserMenu';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Account');
  const [segment, setSegment] = useState('account');
  const [loaded] = useState(true);
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  const closeElement = () => navigate(`/${localStorage.getItem('project')}`);

  return (
    <>
      <OpacityHeader isAtTop={isAtTop} title={title} closeElement={closeElement} segment={segment} />
      <div className="app-container-result result-page">
        <main ref={scrollRef} className={`content image-result ${loaded ? 'fade-in' : ''}`}>
          {<UserMenu/>}
        </main>
      <footer className="footer"></footer>
      </div>
    </>
  );
};

export default Account;

