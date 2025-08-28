/* FM: Implements a draggable horizontal split view. Used to separate Sidebar and MainView with adjustable proportions. */

import React, { useState, useRef, useEffect } from 'react';
import styles from './ResizableSplitViewHorizontal.module.css';

export function ResizableSplitViewHorizontal({ children }) {
    console.log('ResizableSplitViewHorizontal rendered');

    const [sidebarWidth, setSidebarWidth] = useState(550);
    const isDragging = useRef(false);

    const handleMouseDown = () => {
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = 'default';
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        setSidebarWidth(Math.max(220, Math.min(e.clientX, window.innerWidth - 200)));
    };

    useEffect(() => {
        console.log('ResizableSplitViewHorizontal.useEffect called');
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const [sidebar, mainarea] = React.Children.toArray(children);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar} style={{ width: sidebarWidth }}>
                {sidebar}
            </div>
            <div className={styles.divider} onMouseDown={handleMouseDown} />
            <div className={styles.mainarea}>
                {mainarea}
            </div>
        </div>
    );
}
