import "../fooldal_styles/rolam.css";

function Rolam() {
    return (
        <div className="rolam-container">

            <div className="row footer">
                <div className="col-sm-12 col-md-7 col-lg-7 bal-rolam">
                    <h2>Rólam</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id totam error dicta consequuntur labore magnam culpa adipisci voluptatum vero placeat expedita, delectus molestias vitae neque maiores mollitia iusto eos eveniet.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id totam error dicta consequuntur labore magnam culpa adipisci voluptatum vero placeat expedita, delectus molestias vitae neque maiores mollitia iusto eos eveniet.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id totam error dicta consequuntur labore magnam culpa adipisci voluptatum vero placeat expedita, delectus molestias vitae neque maiores mollitia iusto eos eveniet.</p>

                </div>

                <div className="col-sm-12 col-md-5 col-lg-5 jobb-rolam">
                    <div className="rolam-profil-container">
                        <img className="rolam-profil" src="./pics/profil.jpg" alt="" />
                    </div>
                    <div className="jobb-rolam-text">
                        <h4>Homolya Zsuzsa</h4>
                        <p>Köröm Technikus</p>
                    </div>
                </div>

                <div className="elvalaszto"></div>

                <div className="Social">
                    <div className="row">
                        <div className="col-sm-12 col-md-3 col-lg-3 ">
                            <img src="" alt="" />
                            <p><a href="">Instagram</a></p>

                        </div>

                        <div className="col-sm-12 col-md-3 col-lg-3 ">
                            <img src="" alt="" />
                            <p><a href="">Facebook</a></p>


                        </div>

                        <div className="col-sm-12 col-md-3 col-lg-3 ">
                            <img src="" alt="" />
                            <p><a href="">Email</a></p>


                        </div>

                        <div className="col-sm-12 col-md-3 col-lg-3 ">
                            <img src="" alt="" />
                            <p><a href="">Tiktok</a></p>


                        </div>
                    </div>
                </div>
            </div>
        </div>

    );




}

export default Rolam