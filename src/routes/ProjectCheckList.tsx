import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScrollListener from '../tools/useScrollListener.js';
import OpacityHeader from '../elements/OpacityHeader.js';
import { API } from '../data/API.js'; const api = new API();
import CheckListItem from "../elements/CheckListItem";

import { getHazardRangeColor } from '../data/levels.js';
import classMap from '../sharedMap';
const svgInst = classMap.get('svgInst');

// const textToken = classMap.get('textToken');

const ProjectResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [title] = useState(id);
  const [safeguards, setSafeguards] = useState([]);
  const [isSwipedOpen, setIsSwipedOpen] = useState(-1)

    useEffect(() => {//Load Initial
        (async () => {
          setLoaded(false)
          const safeguards = await api.getSafeGuards({project: id})
          setSafeguards(safeguards)
        })();
      setLoaded(true)
    }, [id]);

    const closeElement = () => navigate('/');

    const checkList = () => {
      return (
        <div className='project-dongle-list'>
          {Object.entries(safeguards)
            .sort(([ratingA], [ratingB]) => Number(ratingB) - Number(ratingA)) // Sort descending by rating
            .map(([rating, safeguardList], index) => {
              // Get the action and background color for the current rating
              const { action, bck_color } = getHazardRangeColor(rating);
              return (
                <div key={index}>
                  {/* Header for each risk_rating with the color ball */}
                  <div className="result-loop-main-wrapper">
                    <div className='checklist-header-wrapper'>
                    <div
                      className='quick-result-ball'
                      style={{ backgroundColor: bck_color }}>
                    </div>
                    <div className='result-loop-header-text-title'>{action}</div>
                    </div>
                  {safeguardList.map((txt, id) => (
                    <div className='checklist-item' key={id}>
                    <CheckListItem key={id} entry={{ selected: false, txt, id }} isSwipedOpen={isSwipedOpen} setIsSwipedOpen={setIsSwipedOpen}/>
                    </div>
                  ))}
                </div>
                </div>
              );
            })}
        </div>
      );
    };
        
  return (
    <>
    <OpacityHeader isAtTop={isAtTop} title={title} closeElement={closeElement}/>
      <div className="app-container-result result-page">
      <main ref={scrollRef} className={`content result-overview ${loaded ? 'fade-in' : ''}`}>
          <div className='image-project-view'>
            {checkList()}
          </div>
      </main>
      </div>
    </>
  );
};

export default ProjectResult;