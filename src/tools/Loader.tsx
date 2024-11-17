import { useState, useEffect } from 'react';

const Loader: React.FC = () => {
    const [loading, setLoading] = useState < boolean > (false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
        }, 0);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, []);

    return (
        <div className="loadingBarContainer">
            <div className={`loadingBar ${loading ? 'loading' : ''}`}></div>
        </div>
    );
};

export default Loader;
