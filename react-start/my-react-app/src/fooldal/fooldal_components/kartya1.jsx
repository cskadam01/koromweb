import '../fooldal_styles/kartyak.css';

function Kartya() {

    return (
        <div className="wrapper">
            <div className='row'>
                <div className="col-sm-12 col-md-12 col-lg-6">
                <article className="card hover line">
                <img className="image" src="./pics/szalon.jpg" alt="" />
                <h2 className="title">Szalon</h2>
                <p className="text">Itt tudsz időpontot foglalni manikűr illetve pedikűr szolgáltatűsaimra</p>
                <button>Ajánlatok</button>
            </article>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
            <article className="card hover line">
                <img className="image" src="./pics/muhely.jpg" alt="" />
                <h2 className="title">Képzés</h2>
                <p className="text">Ha érdekel ez a szakma, jelentkezz képzéseimre</p>
                <button>Bővebben</button>
            </article>
            </div>

            </div>
        </div>
    );

}
export default Kartya