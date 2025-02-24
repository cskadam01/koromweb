import Leiras from "./kepzes_components/leiras";
import Video from "./kepzes_components/video";
import FoglalasKartyak from "./kepzes_components/userFoglalas";
import Modal from "react-modal";
import KepzesHeader from "./kepzes_components/kepzes_header";
import Terkep from "./kepzes_components/terkep";



// React Modal beállítása a teljes oldalra
Modal.setAppElement("#root");

function Kepzes(){
    return(
        <>  
            <KepzesHeader/>
            <Leiras/>
            <FoglalasKartyak/>
            <Video/>
            <Terkep/>
        </>
    );
}

export default Kepzes;
