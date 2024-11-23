import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useScrollListener from '../tools/useScrollListener';
import OpacityHeader from '../elements/OpacityHeader';
import { API } from '../data/API.js'; const api = new API();
import ProjectDongle from '../elements/ProjectDongle';

import classMap from '../sharedMap';
const textToken = classMap.get('textToken');

const ProjectResult: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the id parameter
  const { scrollRef, isAtTop } = useScrollListener({ scrollDown: false });
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [title] = useState(textToken.getToken('projectOverview'));
  const [projects, setProjects] = useState([]);

    useEffect(() => {//Load Initial
        (async () => {
          setLoaded(false)
          const projects = await api.getProjectOverview()
          setProjects(projects)
        })();
      setLoaded(true)
    }, [id]);

    const closeElement = () => navigate('/');

    const dialogProjects = () => {
    return (
      <>
      <div className='project-dongle-list'>
        {projects.map((project, index) => (
            <div className='project-dongle-list' key={index}>
              <ProjectDongle entry={project}/>
            </div>

        ))}
        </div>
      </>
    );
  };

  return (
    <>
    <OpacityHeader isAtTop={isAtTop} title={title} closeElement={closeElement}/>
      <div className="app-container-result result-page">
      <main ref={scrollRef} className={`content result-overview ${loaded ? 'fade-in' : ''}`}>
          <div className='image-project-view'>
          {dialogProjects()}
          </div>
      </main>
      </div>
    </>
  );
};

export default ProjectResult;