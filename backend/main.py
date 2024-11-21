from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Titkos kulcs a JWT aláírásához
SECRET_KEY = "szupertitkoskulcs123!"  # Ezt cseréld egy biztonságosabb kulcsra

# MySQL adatbázis beállítások
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",  # Cseréld ki a helyes jelszóra
    database="zsuzsakorom"
)

# Token blacklist (opcionális)
blacklist = set()

@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Kapott adatok naplózása
        data = request.get_json()
        username = data.get('username').strip()
        password = data.get('password')

        # SQL lekérdezés
        cursor = db.cursor()
        cursor.execute("SELECT adminPass FROM admin WHERE adminName = %s", (username,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"success": False, "message": "Felhasználó nem található"}), 404

        # Jelszó ellenőrzése
        stored_password = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            # Token generálása
            token = jwt.encode(
                {"username": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                SECRET_KEY,
                algorithm="HS256"
            )
            return jsonify({"success": True, "token": token}), 200
        else:
            return jsonify({"success": False, "message": "Hibás jelszó"}), 401

    except mysql.connector.Error as db_error:
        print("Adatbázis hiba:", str(db_error))
        return jsonify({"success": False, "message": "Adatbázis hiba"}), 500

    except Exception as e:
        print("Ismeretlen hiba:", str(e))
        return jsonify({"success": False, "message": "Szerverhiba"}), 500


@app.route('/api/admin', methods=['GET'])
def admin():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"success": False, "message": "Token szükséges"}), 401

    # Vegyük le a "Bearer" előtagot, ha jelen van
    token = token.replace("Bearer ", "")

    if token in blacklist:
        return jsonify({"success": False, "message": "Token érvénytelenített"}), 401

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"success": True, "message": f"Üdv, {decoded_token['username']}! Admin hozzáférés engedélyezve."}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Token lejárt"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Érvénytelen token"}), 401


@app.route('/api/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization').replace("Bearer ", "")
    blacklist.add(token)  # Token hozzáadása a blacklisthez
    return jsonify({"success": True, "message": "Token érvénytelenítve"}), 200


@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


if __name__ == '__main__':
    app.run(debug=True)
