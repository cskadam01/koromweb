# Koromweb

Ez egy **React + Flask** alapú webalkalmazás időpontfoglaláshoz és adminisztrációhoz.

## Funkciók

### Felhasználói oldal
- Szolgáltatás bemutatása
- Időpontfoglalás

### Admin oldal
- **Időpontok létrehozása** maximális férőhellyel
- **Testreszabás**: az admin dönthet arról, hogy milyen témák jelenjenek meg az oldalon
- **Foglalások kezelése**: az admin eldöntheti, hogy egy foglalást megerősít vagy elutasít
- **Automatikus e-mail küldés** a foglalás létrehozásakor és a megerősítés visszaigazolásakor

### Hitelesítés
- Az admin oldal eléréséhez **JWT tokent** használ a rendszer
- A védett (protected) oldalakhoz a felhasználónak be kell jelentkeznie, és megfelelő jogosultsággal kell rendelkeznie

## Adatbázis struktúra

| **Tábla neve**    | **Leírás** |
|-------------------|-----------|
| `admin`          | Az admin felhasználó adatai |
| `foglalasok`     | A felhasználók foglalásai és státuszuk (`pending` vagy `confirmed`) |
| `idopontok`      | Az admin által megadott időpontok és kapcsolódó tanfolyamok |
| `kepzesek`       | Az elérhető képzések és azokhoz tartozó képfájlok elérési útja |

## Képzések és videók
- A képzések oldalán található videók **Dropboxról** kerülnek beágyazásra.





