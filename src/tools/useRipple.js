import { useCallback } from 'react';

const useRipple = () => {
    const handleRipple = useCallback((event, buttonRef) => {
        const button = buttonRef.current;

        if (!button) return;

        // Get the button's position and size
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        // Create a ripple element
        const ripple = document.createElement("span");
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add("ripple");

        // Append the ripple and remove it after animation
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, []);

    return handleRipple;
};

export default useRipple;
