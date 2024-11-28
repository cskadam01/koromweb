from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import jwt
import datetime
import mysql.connector

app = Flask(__name__)

# Flask-CORS konfiguráció
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Flask titkos kulcs a JWT-hez
app.config['SECRET_KEY'] = 'your_secret_key_here'

# Adatbázis-kapcsolat
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="zsuzsakorom"
)

# OPTIONS preflight válaszkezelés
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Bejelentkezési végpont
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        # OPTIONS kérésekre üres válasz
        return jsonify({"success": True}), 200

    data = request.get_json()
    username = data.get('username').strip()
    password = data.get('password').strip()

    # Debug üzenetek
    print("Kapott felhasználónév:", username)
    print("Kapott jelszó:", password)

    try:
        # Adatbázis lekérdezés
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT adminPass FROM admin WHERE adminName = %s", (username,))
        user = cursor.fetchone()

        if not user:
            print("Felhasználó nem található az adatbázisban.")
            return jsonify({"success": False, "message": "Felhasználó nem található"}), 404

        print("Adatbázisból származó hash:", user['adminPass'])

        # Jelszó ellenőrzése
        if not bcrypt.checkpw(password.encode('utf-8'), user['adminPass'].encode('utf-8')):
            print("Hibás jelszó.")
            return jsonify({"success": False, "message": "Hibás jelszó"}), 401

        # JWT token generálása
        token = jwt.encode(
            {"username": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        print("Sikeres hitelesítés, generált token:", token)
        return jsonify({"success": True, "token": token}), 200
    except Exception as e:
        print("Hiba történt:", str(e))
        return jsonify({"success": False, "message": "Szerverhiba", "error": str(e)}), 500
    finally:
        cursor.close()

# Védett végpont példa
@app.route('/api/admin', methods=['GET'])
def admin():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"success": False, "message": "Hiányzik a token"}), 401

    try:
        # Token ellenőrzése
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        return jsonify({"success": True, "message": f"Üdv, {decoded['username']}!"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "A token lejárt"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Érvénytelen token"}), 401
    


@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Lekéri az összes nem megerősített foglalást a felhasználói adatokkal együtt."""
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                a.foglalId, a.datum, a.kezdIdo, a.vegIdo, 
                u.userName, u.userPhone, u.userEmail
            FROM appointment a
            JOIN users u ON a.userId = u.userId
            WHERE a.megerosit = 0
        """)
        bookings = cursor.fetchall()

        # Dátum formázása
        for booking in bookings:
            booking["datum"] = booking["datum"].strftime('%Y. %b %d.')

        cursor.close()
        return jsonify(bookings), 200
    except Exception as e:
        print("Hiba a foglalások lekérésekor:", str(e))
        return jsonify({"success": False, "message": "Hiba történt a foglalások lekérésekor", "error": str(e)}), 500


@app.route('/api/confirm-booking', methods=['POST'])
def confirm_booking():
    """Foglalás megerősítése."""
    try:
        cursor = db.cursor(dictionary=True)
        data = request.get_json()
        foglalId = data.get("foglalId")

        # Ellenőrzés: Létezik-e a foglalás?
        cursor.execute("SELECT megerosit FROM appointment WHERE foglalId = %s", (foglalId,))
        booking = cursor.fetchone()

        if not booking:
            return jsonify({"success": False, "message": "Foglalás nem található"}), 404

        # Ellenőrzés: Már megerősítették?
        if booking["megerosit"] == 1:
            return jsonify({"success": False, "message": "Ez a foglalás már meg van erősítve"}), 400

        # Foglalás megerősítése
        cursor.execute("UPDATE appointment SET megerosit = 1 WHERE foglalId = %s", (foglalId,))
        db.commit()

        # Visszaadjuk a megerősített foglalások listáját
        cursor.execute("""
            SELECT 
                a.foglalId, a.datum, a.kezdIdo, a.vegIdo, 
                u.userName, u.userPhone, u.userEmail
            FROM appointment a
            JOIN users u ON a.userId = u.userId
            WHERE a.megerosit = 1
        """)
        confirmed_bookings = cursor.fetchall()

        for booking in confirmed_bookings:
            booking["datum"] = booking["datum"].strftime('%Y. %b %d.')

        return jsonify({"success": True, "message": "Foglalás sikeresen megerősítve", "confirmed": confirmed_bookings}), 200

    except Exception as e:
        print("Hiba történt a foglalás megerősítésekor:", str(e))
        return jsonify({"success": False, "message": "Hiba történt a foglalás megerősítésekor", "error": str(e)}), 500
    finally:
        cursor.close()


if __name__ == '__main__':
    app.run(debug=True)
