from flask import Flask, request, jsonify, g
from flask_cors import CORS
import bcrypt
import jwt
import datetime
import mysql.connector
from datetime import timedelta

app = Flask(__name__)

# Flask-CORS konfiguráció
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Flask titkos kulcs a JWT-hez
app.config['SECRET_KEY'] = 'your_secret_key_here'

# Kapcsolat létrehozása a kérés előtt
def get_db_connection():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="zsuzsakorom"
        )
    return g.db

# Kapcsolat lezárása a kérés után
@app.teardown_appcontext
def close_db_connection(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# OPTIONS preflight válaszkezelés
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

#region Bejelentkezés Api
# Bejelentkezési végpont
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"success": False, "message": "Hiányzó adatok"}), 400

    username = data.get('username').strip()
    password = data.get('password').strip()

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT adminPass FROM admin WHERE adminName = %s", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Felhasználó nem található"}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['adminPass'].encode('utf-8')):
            return jsonify({"success": False, "message": "Hibás jelszó"}), 401

        token = jwt.encode(
            {"username": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        return jsonify({"success": True, "token": token}), 200

    except Exception as e:
        print(f"Hiba a login API-nál: {str(e)}")
        return jsonify({"success": False, "message": "Szerverhiba", "error": str(e)}), 500

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
# endregion

# region Megerősített foglalások lekérése
@app.route('/api/get_booking_c', methods=['GET'])
def get_booking_c():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                a.foglalId, a.datum, a.kezdIdo, a.vegIdo, 
                u.userName, u.userPhone, u.userEmail
            FROM appointment a
            JOIN users u ON a.userId = u.userId
            WHERE a.megerosit = 1
        """)
        bookings = cursor.fetchall()

        for booking in bookings:
            booking["datum"] = booking["datum"].strftime('%Y-%m-%d') 

        return jsonify(bookings), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Hiba történt a foglalások lekérésekor", "error": str(e)}), 500
    finally:
        cursor.close()
# endregion
# region Nem megerősített foglalások lekérése
@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        db = get_db_connection()
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

        for booking in bookings:
            booking["datum"] = booking["datum"].strftime('%Y-%m-%d') 

        return jsonify(bookings), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Hiba történt a foglalások lekérésekor", "error": str(e)}), 500
    finally:
        cursor.close()

#endregion

#region Nem megerősített kéréseknek visszautasítása
@app.route('/api/delete-pending-booking', methods=['POST'])
def delete_pending_booking():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Kérésből kapott adat
        data = request.get_json()
        foglalId = data.get("foglalId")  # Az egyedi azonosító

        # Ellenőrizzük, hogy létezik-e a foglalás és az még pending-e
        cursor.execute("SELECT megerosit FROM appointment WHERE foglalId = %s", (foglalId,))
        booking = cursor.fetchone()

        if not booking:
            return jsonify({"success": False, "message": "Foglalás nem található"}), 404

        if booking["megerosit"] == 1:
            return jsonify({"success": False, "message": "Ez a foglalás már meg van erősítve"}), 400

        # Foglalás törlése
        cursor.execute("DELETE FROM appointment WHERE foglalId = %s", (foglalId,))
        db.commit()

        return jsonify({"success": True, "message": "Foglalás sikeresen törölve"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Hiba történt a törlés során", "error": str(e)}), 500

    finally:
        cursor.close()






#endregion
#region Foglalások megerősítése
@app.route('/api/confirm-booking', methods=['POST'])
def confirm_booking():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        data = request.get_json()
        foglalId = data.get("foglalId")

        cursor.execute("SELECT megerosit FROM appointment WHERE foglalId = %s", (foglalId,))
        booking = cursor.fetchone()

        if not booking:
            return jsonify({"success": False, "message": "Foglalás nem található"}), 404

        if booking["megerosit"] == 1:
            return jsonify({"success": False, "message": "Ez a foglalás már meg van erősítve"}), 400

        cursor.execute("UPDATE appointment SET megerosit = 1 WHERE foglalId = %s", (foglalId,))
        db.commit()

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
        return jsonify({"success": False, "message": "Hiba történt a foglalás megerősítésekor", "error": str(e)}), 500
    finally:
        cursor.close()
#endregion





#region Foglalás Létrehozása
@app.route('/api/book', methods=['POST'])
def book_appointment():
    data = request.get_json()

    # Kötelező mezők ellenőrzése
    if not data.get('userName') or not data.get('start_time') or not data.get('duration'):
        return jsonify({"success": False, "message": "Hiányzó adatok"}), 400

    try:
        user_name = data['userName']
        user_phone = data.get('userPhone', '')  # Opcionális
        user_email = data.get('userEmail', '')  # Opcionális
        start_time = datetime.fromisoformat(data['start_time'])  # ISO formátum
        duration = int(data['duration'])  # Percekben

        # Ellenőrizzük az időpontot (ne legyen átfedés más foglalásokkal)
        end_time = start_time + timedelta(minutes=duration)
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM appointments
            WHERE start_time < %s AND DATE_ADD(start_time, INTERVAL duration MINUTE) > %s
        """, (end_time, start_time))
        conflicts = cursor.fetchall()

        if conflicts:
            return jsonify({"success": False, "message": "Az időpont foglalt"}), 409

        # Foglalás mentése
        cursor.execute("""
            INSERT INTO appointments (userName, userPhone, userEmail, start_time, duration, status)
            VALUES (%s, %s, %s, %s, %s, 'pending')
        """, (user_name, user_phone, user_email, start_time, duration))
        db.commit()

        return jsonify({"success": True, "message": "Foglalás sikeresen létrehozva"}), 201

    except Exception as e:
        return jsonify({"success": False, "message": "Hiba történt", "error": str(e)}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()


#region elérhető időpontok hozzá adása
@app.route('/api/availability', methods=['POST'])
def add_availability():
    try:
        # JSON adat beolvasása
        data = request.get_json()
        date = data.get('date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Adatok ellenőrzése
        if not date or not start_time or not end_time:
            return jsonify({"success": False, "message": "Hiányzó adatok"}), 400

        # Adatok mentése az adatbázisba
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO availability (datum, startTime, endTime)
            VALUES (%s, %s, %s)
        """, (date, start_time, end_time))
        db.commit()

        return jsonify({"success": True, "message": "Elérhetőség hozzáadva"}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()
#end region
#region Elérhető időpontok hozzá adása:
@app.route('/api/availability', methods=['GET'])
def get_availability():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, datum, startTime, endTime, creation FROM availability")
        availability = cursor.fetchall()

        # timedelta formázás stringgé alakítva
        for item in availability:
            item['startTime'] = str(item['startTime'])  # TIME típus stringgé alakítása
            item['endTime'] = str(item['endTime'])  # TIME típus stringgé alakítása
            item['datum'] = item['datum'].strftime('%Y-%m-%d')  # Dátum string formátum

        return jsonify(availability), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        db.close()
#endregion



if __name__ == '__main__':
    app.run(debug=True)
