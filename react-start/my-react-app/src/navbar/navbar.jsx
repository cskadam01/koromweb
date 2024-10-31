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


    </ul>
</nav>
<div className="Scroll-down">
    <ul className="Scroll-ul">
        <Link to="/" style={{textDecoration:'none'}}>
            <li className="apro-a" >Főoldal</li>
            </Link>

            <Link to="./galleria" style={{textDecoration:'none'}}>
            <li className="apro-a">Galléria</li>
            </Link>

            <Link to="./kepzes" style={{textDecoration:'none'}} >
            <li className="apro-a">Képzés</li>
            </Link>

            <Link to="./szalon" style={{textDecoration:'none'}}>
            <li className="apro-a">Szolgáltatás</li>
            </Link>


            </ul>



        </div>



</div>

       
    );
}

export default Navbar
