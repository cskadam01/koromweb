import React from 'react';
import '../kepzes_styles/video.css';
function Video() {
    return (
        <div className='main-vid'>
            
            
        <div className="video-container">
        <div className='video-text'>
            <h3 style={{fontFamily:"Gloock"}}>Műhelyem ahol a képzés történik</h3>

            <p style={{fontFamily:'Hansen'}}>
            A Körömműhely egy több szépségipari szolgáltatást működtető fitness teremben van Budapest 16. kerületében.
Itt várom a vendégeimet és ezen a helyen tartom az egyéni képzéseket is.
Egy nálam töltött nap alatt sok mindent megtanulhatsz a szalon munka csodás világáról, hangulatáról és remek ötleteket meríthetsz tapasztalataimból, megoldásaimból is.
Sok olyan hasznos apróság van ami jelentősen egyszerűsíti, ezáltal gyorsítja a munkádat, így több időd marad minőségi munkát kiadni a kezedből.
Várlak szeretettel!
            </p>
            <p style={{fontFamily:"Palatino Linotype"}}>Zsuzsa</p>
        </div>
           
        <div>
            <video autoPlay loop muted>
                <source className='video' src="https://dl.dropboxusercontent.com/scl/fi/kxklnzfifsdwwfxctop8u/muhely.mov?rlkey=ajnrn8419mxnjtatabaipkrd6&st=1d8gymx2" type="video/mp4" />
                A böngésződ nem támogatja a videók lejátszását.
            </video>
        </div>
        </div>
        </div>

    );
}

export default Video;