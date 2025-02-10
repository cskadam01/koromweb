import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../kepzes_styles/leiras.css';

const Leiras = () => {
    const [kepzesek, setKepzesek] = useState([]);

    useEffect(() => {
        fetchKepzesek();
    }, []);

    const fetchKepzesek = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/kepzesek');
            setKepzesek(response.data);
        } catch (error) {
            console.error("Hiba a képzések lekérdezésekor:", error);
        }
    };

    return (
        <div className="kepzes-container">
            
            <div className="kepzes-list">
                {kepzesek.map((kepzes) => (
                    <div key={kepzes.id} className="kepzes-card">
                        <img src={`http://localhost:5000/uploads/${kepzes.kep}`} alt={kepzes.cim} />
                        <div className="kepzes-info">
                            <h3>{kepzes.cim}</h3>
                            <p>{kepzes.leiras}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leiras;







