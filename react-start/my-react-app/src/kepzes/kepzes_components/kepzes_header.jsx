import React from 'react';
import '../kepzes_styles/kepzesHeader.css';

function KepzesHeader() {
    return (
        <header className="kepzes-header">
            <div className="kepzes-header-overlay">
                <div className="kepzes-header-content">
                    <h1>Képzéseim</h1>
                    <p>Fedezd fel a legmodernebb technikákat és fejleszd a tudásod egyedi képzéseimen!</p>
                </div>
            </div>
        </header>
    );
}

export default KepzesHeader;