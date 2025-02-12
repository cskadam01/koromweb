import React from "react";


function Aszf() {
    return(
        <>
            <div className="adatvedelmi-container" style={{padding:'50px'}}>
            <h1>Adatvédelmi tájékoztató</h1>

            <h2>1. Az adatkezelő adatai</h2>
            <p><strong>Adatkezelő neve:</strong> Homolya Zsuzsa</p>
            <p><strong>Székhely:</strong> Timur utca 103</p>
            <p><strong>Elérhetőség:</strong> homolyazsuzsa@gmail.com</p>

            <h2>2. Az adatkezelés célja és jogalapja</h2>
            <p>Az adatkezelés célja az online időpontfoglalás biztosítása, a felhasználók értesítése és az adminisztráció megkönnyítése.</p>
            <p>Az adatkezelés jogalapja az érintett hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont), valamint az adatkezelő jogos érdeke a szolgáltatás nyújtására (GDPR 6. cikk (1) bekezdés f) pont).</p>

            <h2>3. A kezelt személyes adatok köre</h2>
            <ul>
                <li><strong>Név:</strong> az időpontfoglalás beazonosításához</li>
                <li><strong>Email cím:</strong> a visszaigazolás és értesítések küldéséhez</li>
                <li><strong>Telefonszám:</strong> kapcsolattartás céljából</li>
            </ul>

            <h2>4. Az adatkezelés időtartama</h2>
            <p>A személyes adatokat a foglalás időpontjától számított <strong>legfeljebb 1 évig</strong> tároljuk, ezt követően automatikusan törlésre kerülnek. A felhasználók jogosultak korábban is kérni adataik törlését.</p>

            <h2>5. Az adatokhoz való hozzáférés és adattovábbítás</h2>
            <p>A személyes adatokhoz kizárólag az adatkezelő és az általa megbízott személyek férhetnek hozzá. Az adatokat harmadik fél részére <strong>nem továbbítjuk</strong>, kivéve, ha azt jogszabály kötelezővé teszi.</p>

            <h2>6. Az érintettek jogai</h2>
            <ul>
                <li><strong>Tájékoztatást kérhet</strong> arról, hogy milyen személyes adatokat kezelünk róla.</li>
                <li><strong>Hozzáférhet</strong> az általunk tárolt adataihoz.</li>
                <li><strong>Kérheti adatai módosítását vagy törlését.</strong></li>
                <li><strong>Tiltakozhat</strong> az adatkezelés ellen.</li>
                <li><strong>Adathordozhatóságot kérhet,</strong> ha az adatok elektronikus formában kerülnek feldolgozásra.</li>
            </ul>
            <p>Ezeket a jogokat az adatkezelő fenti elérhetőségén lehet gyakorolni.</p>

            <h2>7. Adatbiztonság</h2>
            <p>Az adatkezelő minden szükséges technikai és szervezési intézkedést megtesz annak érdekében, hogy a személyes adatok biztonságosan legyenek tárolva, és ne történhessen illetéktelen hozzáférés.</p>

            <h2>8. Jogorvoslati lehetőségek</h2>
            <p>Ha a felhasználó úgy érzi, hogy személyes adatainak kezelése sérti a jogait, jogosult panaszt benyújtani a <strong>Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH)</strong>:</p>
            <ul>
                <li><strong>Cím:</strong> 1055 Budapest, Falk Miksa utca 9-11.</li>
                <li><strong>Weboldal:</strong> <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">www.naih.hu</a></li>
                <li><strong>Email:</strong> <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a></li>
            </ul>

            <h2>9. Az adatvédelmi tájékoztató módosítása</h2>
            <p>Az adatkezelő fenntartja a jogot, hogy ezt a tájékoztatót bármikor módosítsa. A frissített verzió mindig elérhető az oldalon.</p>
        </div>
        </>

    )
}

export default Aszf