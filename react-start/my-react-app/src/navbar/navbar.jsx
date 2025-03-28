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
            <li className="bal-nav">Galéria</li>
            </Link>

            <Link to="./kepzes">
            <li className="bal-nav">Képzés</li>
            </Link>

            {/* <Link to="./szalon">
            <li className="bal-nav">Időpont Foglalás</li>
            </Link> */}

        </div>
        <li className="navbar-nev">Körömműhely</li>


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

            {/* <Link to="./szalon" style={{textDecoration:'none'}}>
            <li className="apro-a">Időpont Foglalás</li>
            </Link> */}


            </ul>



        </div>



</div>

       
    );
}

export default Navbar
