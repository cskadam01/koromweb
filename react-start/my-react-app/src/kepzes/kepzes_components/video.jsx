import React from 'react';
import '../kepzes_styles/video.css';
function Video() {
    return (
        <div className='main-vid'>
            <h3>Műhelyem ahol a képzés történik</h3>
            
        <div className="video-container">
           

            <video autoPlay loop muted>
                <source src="https://www.dropbox.com/scl/fi/pj60xqwr2tbcui713nhal/let-s-do-xiaohongshu-inspired-nails-at-home-asmr-nail-prep-gel-x-application-blush-nails.mp4?rlkey=0nevuldtp9sftz8bgzikamjtu&st=nezkzb7t&raw=1" type="video/mp4" />
                A böngésződ nem támogatja a videók lejátszását.
            </video>
        </div>
        </div>

    );
}

export default Video;