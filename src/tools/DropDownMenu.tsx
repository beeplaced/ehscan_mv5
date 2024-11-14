import React, { useState, useEffect } from 'react';

const DropdownMenu = ({ result, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(result.selected);
    const [selectedLoop, setSelectedLoop] = useState([]);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); // Toggle dropdown
    };

    const handleOptionClick = (selected) => {
        setSelectedOption(selected);
        setIsOpen(false);
        if (onChange) {
            onChange({[result.title]: parseInt(selected)}); // Notify parent of the change
        }
    };

    useEffect(() => {
        switch (true) {
            case result.title === 'bla':
                // Add any specific logic for 'bla' case
                break;

            default://imagerepeat
                setSelectedLoop(['1','2','3','4','5','6','7','8','9','10'])
                break;
        }

        if (result.selected !== selectedOption) {
            setSelectedOption(result.selected);
        }
    }, []); // Depend on result and selectedOption

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {selectedOption}
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    {selectedLoop.map((item, index) => (
                        <li key={index} onClick={() => handleOptionClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;


                // <ul className="dropdown-menu">
                //     <li onClick={() => handleOptionClick('1')}>1</li>
                //     <li onClick={() => handleOptionClick('2')}>2</li>
                //     <li onClick={() => handleOptionClick('3')}>3</li>
                //     <li onClick={() => handleOptionClick('4')}>4</li>
                //     <li onClick={() => handleOptionClick('5')}>5</li>
                // </ul>
