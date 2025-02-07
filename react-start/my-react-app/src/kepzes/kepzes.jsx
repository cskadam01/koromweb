import Leiras from "./kepzes_components/leiras";
import Video from "./kepzes_components/video";
import FoglalasKartyak from "./kepzes_components/userFoglalas";
import Modal from "react-modal";

// React Modal beállítása a teljes oldalra
Modal.setAppElement("#root");

function Kepzes(){
    return(
        <>
            <Leiras/>
            <FoglalasKartyak/>
            <Video/>
        </>
    );
}

export default Kepzes;
