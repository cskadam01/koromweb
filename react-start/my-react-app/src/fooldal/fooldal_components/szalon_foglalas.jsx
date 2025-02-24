import React from "react";
import '../fooldal_styles/szalon_foglalas.css';



function ToSalon(){
    return(
        <div className="tosalon-container">
            <div className="tosalon-text">
            <h1>Inspirálódj!</h1>
            <p>A klasszikus manikűrtől és pedikűrtől </p><p> a legújabb körömtrendekig  nálunk mindent megtalálsz, ami a tökéletes megjelenésedhez kell!</p>
            <button onClick={() => window.location.href = "https://www.instagram.com/zsuzsahomolya/"}>
            Nézzük Meg!
            </button>
            </div>

        </div>
    )
}

export default ToSalon