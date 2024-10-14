import '../styles/kartyak.css';

function Kartyaone() {

    return (
        <div class="wrapper">
            <article class="card hover line">
                <img class="image" src="./pics/szalon.jpg" alt="" />
                <h2 class="title">Szalon</h2>
                <p class="text">Itt tudsz időpontot foglalni manikűr illetve pedikűr szolgáltatűsaimra</p>
                <button>Ajánlatok</button>
            </article>

            <article class="card hover line">
                <img class="image" src="./pics/muhely.jpg" alt="" />
                <h2 class="title">Képzés</h2>
                <p class="text">Ha érdekel ez a szakma, jelentkezz képzéseimre</p>
                <button>Bővebben</button>
            </article>


        </div>
    );

}
export default Kartyaone