function Navbar() {

    return(
       
            
<nav>
    <ul className="ul-nav">
    
        <div className="left-nav">
          
            <li><a className="bal-nav" href="">Főoldal</a></li>
            <li><a className="bal-nav" href="">Galléria</a></li>
            <li><a className="bal-nav" href="">Képzés</a></li>
            <li><a className="bal-nav" href="">Szolgáltatás</a></li>
        </div>
        <li className="navbar-nev">Zsuzsa Köröm Műhelye</li>
        <div className="right-nav">
            <li><a className="active-nav" href="">Bejelentkezés</a></li>
            <li><a className="active-nav" href="">Regisztráció</a></li>
        </div>
        
    </ul>
</nav>

       
    );
}

export default Navbar
