import React from "react";

function Admin() {
    const handleOpenAdmin = () => {
        window.open("https://koalendar.com/e/zsuzsakorom/edit", "_blank");
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h2>Admin felület</h2>
            <button onClick={handleOpenAdmin} style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}>
                Nyisd meg az admin felületet
            </button>
        </div>
    );
}

export default Admin;