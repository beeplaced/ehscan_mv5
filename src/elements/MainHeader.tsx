import classMap from '../sharedMap';
const textToken = classMap.get('textToken');
const svgInst = classMap.get('svgInst');

const MainHeader: React.FC = ({ isAtTop, title, setShowDialog }) => {


  const editProject = () => {
     setShowDialog(true)
  }

  return (
    <>
        <header className={`header opacity main ${!isAtTop ? 'shrink' : ''}`}>
          {isAtTop && (<div className="" dangerouslySetInnerHTML={{ __html: svgInst.segments('project') }}></div>)}
          <div className='header-title _t'>{title}</div>
          {isAtTop && (<div className="header-close" onClick={() => editProject()}>{textToken.getToken('edit')}</div>)}
        </header>
        </>
  )
}

export default MainHeader;
