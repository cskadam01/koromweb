import { Link } from "react-router-dom";




function Navbar() {

    return(
       
<div className="Navbar">            
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


    </ul>
</nav>
<div className="Scroll-down">
    <ul className="Scroll-ul">
        <Link to="/">
            <li className="apro-a" >Főoldal</li>
            </Link>

            <Link to="./galleria">
            <li className="apro-a">Galléria</li>
            </Link>

            <Link to="./kepzes">
            <li className="apro-a">Képzés</li>
            </Link>

            <Link to="./szalon">
            <li className="apro-a">Szolgáltatás</li>
            </Link>
            <Link to="./login">
            <li className="apro-lr">Bejelentkezés</li>
            </Link>

            <Link to="./login">
            <li className="apro-lr">Regisztráció</li>
            </Link> 

            </ul>



        </div>



</div>

       
    );
}

export default Navbar
