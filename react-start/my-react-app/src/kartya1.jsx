import styles from './kartyak.module.css'

function Kartyaone() {

    return (
        <div className={styles.kartyak} >
            
            
                <button>
                    <img src="/pics/muhely.jpg" alt="Gomb 1 képe" />
                    <span>Gomb 1</span>
                </button>
                <button>
                    <img src="/pics/szalon.jpg" alt="Gomb 2 képe" />
                    <span>Gomb 2</span>
                </button>
            

        </div>
    );

}
export default Kartyaone