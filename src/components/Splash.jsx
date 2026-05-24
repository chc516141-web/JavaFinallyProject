import React, { useEffect, useState } from 'react';
import './Splash.css';

const Splash = ({ onFinished }) => {
    useEffect(() => {
        // טיימר שמפעיל את פונקציית הסיום לאחר 3 שניות (זמן האנימציה)
        const timer = setTimeout(() => {
            onFinished();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onFinished]);

    return (
        <div id="splash-screen">
            <div class="road">
                <div class="car">🚗</div>
            </div>
            <h1 class="loading-text">ברוכים הבאים לאתר הרכבים...</h1>
        </div>
    );
};

export default Splash;