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

if __name__ == '__main__':
    app.run(debug=True)
