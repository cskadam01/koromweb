// Szükséges csomagok importálása
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors');


// Express szerver inicializálása
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware a JSON adatok kezeléséhez
app.use(express.json());
app.use(cors()); 

app.get('/test', (req, res) => {
    res.send('Server is working');
});

// Adatbáziskapcsolat beállítása
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // adatbázis jelszó (ha van)
    database: 'korom_muhely' // saját adatbázis neve
});

// Regisztrációs végpont
app.post('/register', async (req, res) => {
    console.log("Reached /register endpoint");
    const { email, password, name } = req.body;

    try {
        db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query('INSERT INTO Users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name], (err, results) => {
                if (err) throw err;
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
