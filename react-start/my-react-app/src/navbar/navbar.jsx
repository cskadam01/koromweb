import { Link } from "react-router-dom";




function Navbar() {

    return(
       
            
<nav>
    <ul className="ul-nav">
    
        <div className="left-nav">
            <Link to="/">
            <li className="bal-nav" >Főoldal</li>
            </Link>

            <Link to="./galleria">
            <li className="bal-nav">Galléria</li>
            </Link>

            <Link to="./kepzes">
            <li className="bal-nav">Képzés</li>
            </Link>

            <Link to="./szalon">
            <li className="bal-nav">Szolgáltatás</li>
            </Link>

        </div>
        <li className="navbar-nev">Zsuzsa Köröm Műhelye</li>
        <div className="right-nav">
            <Link to="./login">
            <li className="active-nav">Bejelentkezés</li>
            </Link>

            <Link to="./login">
            <li className="active-nav">Regisztráció</li>
            </Link>         
            
        </div>
        <div className="apro"></div>


    </ul>
</nav>

       
    );
}

export default Navbar
