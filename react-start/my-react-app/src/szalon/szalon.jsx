function Foglalas() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <h2 style={{ textAlign: "center" }}>Foglalj időpontot</h2>
            <iframe 
                src="https://koalendar.com/e/zsuzsakorom"  
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: "none", maxWidth: "1200px", margin: "0 auto", display: "block" }}>
            </iframe>
        </div>
    );
}

export default Foglalas;
