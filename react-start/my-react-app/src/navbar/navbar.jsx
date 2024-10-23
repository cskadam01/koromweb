import { Link } from "react-router-dom";




function Navbar() {

    return(
       
            
<nav>
    <ul className="ul-nav">
    
        <div className="left-nav">
            <Link to="/">
            <li><a className="bal-nav" href="">Főoldal</a></li>
            </Link>

            <Link to="./galleria">
            <li><a className="bal-nav" href="">Galléria</a></li>
            </Link>

            <Link to="./kepzes">
            <li><a className="bal-nav" href="">Képzés</a></li>
            </Link>

            <Link to="./szalon">
            <li><a className="bal-nav" href="">Szolgáltatás</a></li>
            </Link>

        </div>
        <li className="navbar-nev">Zsuzsa Köröm Műhelye</li>
        <div className="right-nav">
            <Link to="./login">
            <li><a className="active-nav" href="">Bejelentkezés</a></li>
            </Link>

            <Link to="./regist">
            <li><a className="active-nav" href="">Regisztráció</a></li>
            </Link>
        </div>
        
    </ul>
</nav>

       
    );
}

export default Navbar
