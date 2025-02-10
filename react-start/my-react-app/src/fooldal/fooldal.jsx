import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./fooldal_components/header";
import Udvozles from './fooldal_components/udvozles';
import Rolam  from "./fooldal_components/rolam";
import ToSalon from "./fooldal_components/szalon_foglalas"
import ToKepzes from './fooldal_components/kepzes_foglalas';
import Socials from './fooldal_components/social';




function Fooldal() {
  return(

    <>
    <Header/>
    <Udvozles/>
    <ToSalon/>
    <ToKepzes/>
    <Rolam/>
    <Socials/>

   
    </>

  );


}

export default Fooldal
