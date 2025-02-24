import React from 'react';
import '../kepzes_styles/video.css';
function Video() {
    return (
        <div className='main-vid'>
            
            
        <div className="video-container">
        <div className='video-text'>
            <h3>Műhelyem ahol a képzés történik</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim sit ullam deserunt dolores, culpa assumenda quidem pariatur. Eaque architecto quaerat voluptatum ad sit fuga adipisci, ab error quidem, perspiciatis veritatis?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, minus! Quas nemo eveniet repudiandae consectetur, optio voluptatibus debitis voluptatum natus repellat perferendis ducimus culpa earum fugit laborum error voluptatem veritatis.</p>
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