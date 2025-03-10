import React from "react";
import '../fooldal_styles/kepzes_foglalas.css'
import { Link } from "react-router-dom";

function ToKepzes(){
    return(
        <div className="tokepzes-content">
            
            <h1>Körömépítő Tanfolyamok</h1>
            <p>Emeld új szintre a köröm készítést, és engedd szabadjára a kreativitásodat profi iránymutatás mellett.</p> <p>Fedezd fel a végtelen dizájnlehetőségeket, és sajátítsd el a jól bevált technikákat egyedi képzéseimen</p>
            <Link to="/kepzes">
                <button>Tudj meg többet!</button>
            </Link>
        </div>

    )


}

export default ToKepzes;