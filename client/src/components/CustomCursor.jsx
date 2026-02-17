import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Use refs for position to avoid re-renders
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const mouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
        };

        const mouseOver = (e) => {
            const target = e.target;
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isClickable);
        };

        const mouseLeave = () => setIsVisible(false);
        const mouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseover', mouseOver);
        document.addEventListener('mouseleave', mouseLeave);
        document.addEventListener('mouseenter', mouseEnter);

        // Smooth animation loop
        let rafId;
        const updateCursor = () => {
            // Faster interpolation for more responsive feel
            const easing = 0.9;
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * easing;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * easing;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
            }
            if (outlineRef.current) {
                outlineRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
            }

            rafId = requestAnimationFrame(updateCursor);
        };
        rafId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseover', mouseOver);
            document.removeEventListener('mouseleave', mouseLeave);
            document.removeEventListener('mouseenter', mouseEnter);
            cancelAnimationFrame(rafId);
        };
    }, [isVisible]);

    return (
        <>
            <div
                ref={dotRef}
                className={`cursor-dot ${isHovering ? 'hover' : ''} ${isVisible ? 'visible' : ''}`}
            />
            <div
                ref={outlineRef}
                className={`cursor-outline ${isHovering ? 'hover' : ''} ${isVisible ? 'visible' : ''}`}
            />
        </>
    );
};

export default CustomCursor;
