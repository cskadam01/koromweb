from flask import Flask, request, jsonify, g
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta
import mysql.connector
from flask_mail import Mail, Message


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
#region Email küldés
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Használhatsz más SMTP szervert is
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'zsuzsaaa03@gmail.com'  # Gmail címed
app.config['MAIL_PASSWORD'] = 'ldce jsoh zeaw ctjl'  # **Gmail alkalmazás-jelszó szükséges!**
app.config['MAIL_DEFAULT_SENDER'] = 'zsuzsaaa03@gmail.com'


mail = Mail(app)

# def send_email():
#     try:
#         data = request.get_json()

#         if not data.get("to") or not data.get("subject") or not data.get("body"):
#             return jsonify({"success": False, "message": "Hiányzó adatok!"}), 400

#         # **Debug print, hogy valóban ezt kapja-e a backend**
#         print(f"Küldendő e-mail:\nCímzett: {data['to']}\nTárgy: {data['subject']}\nSzöveg:\n{data['body']}")

#         msg = Message(subject=data["subject"], recipients=[data["to"]])
#         msg.body = data["body"]
#         mail.send(msg)

#         return jsonify({"success": True, "message": "E-mail elküldve!"}), 200

#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500






#region Bejelentkezés Api
# Bejelentkezési végpont
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({"success": False, "message": "Hiányzó adatok"}), 400

        username = data.get('username').strip()
        password = data.get('password').strip()

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT adminPass FROM admin WHERE adminName = %s", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Felhasználó nem található"}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['adminPass'].encode('utf-8')):
            return jsonify({"success": False, "message": "Hibás jelszó"}), 401

        # **Helyes időkezelés JWT generálásnál**
        token = jwt.encode(
            {"username": username, "exp": datetime.utcnow() + timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )

        return jsonify({"success": True, "token": token}), 200

    except Exception as e:
        print("Hiba a login API-nál:", str(e))  # Debugging print
        return jsonify({"success": False, "message": "Szerverhiba", "error": str(e)}), 500

    finally:
        cursor.close()
        db.close()
# endregion
#region csoportos orak
@app.route('/api/idopontok', methods=['GET'])
def get_idopontok():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM idopontok ORDER BY datum ASC")
        idopontok = cursor.fetchall()
        return jsonify(idopontok)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()  # 📌 Minden API végén bezárjuk a kapcsolatot!

# 🔹 2. API: Új időpont hozzáadása
@app.route('/api/idopontok', methods=['POST'])
def add_idopont():
    db = get_db_connection()
    cursor = db.cursor()
    try:
        data = request.json
        datum = data.get('datum')
        kezdes_ido = data.get('kezdes_ido') if data.get('kezdes_ido') else None
        vege_ido = data.get('vege_ido') if data.get('vege_ido') else None
        max_ferohely = data.get('max_ferohely')

        if not datum or not max_ferohely:
            return jsonify({"error": "Dátum és férőhely megadása kötelező!"}), 400

        query = "INSERT INTO idopontok (datum, kezdes_ido, vege_ido, max_ferohely) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (datum, kezdes_ido, vege_ido, max_ferohely))
        db.commit()

        return jsonify({"message": "Időpont sikeresen hozzáadva!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()  # 📌 Minden API végén bezárjuk a kapcsolatot!

# 🔹 3. API: Időpont törlése
@app.route('/api/idopontok/<int:id>', methods=['DELETE'])
def delete_idopont(id):
    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM idopontok WHERE id = %s", (id,))
        db.commit()
        return jsonify({"message": "Időpont törölve!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()  # 📌 Minden API végén bezárjuk a kapcsolatot!



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
    db = None
    cursor = None
    try:
        data = request.json
        idopont_id = data.get("idopont_id")
        user_nev = data.get("user_nev")
        user_email = data.get("user_email")
        user_telefon = data.get("user_telefon")

        if not idopont_id or not user_nev or not user_email or not user_telefon:
            return jsonify({"error": "Minden mező kitöltése kötelező!"}), 400

        db = get_db_connection()
        cursor = db.cursor()

        query = "INSERT INTO foglalasok (idopont_id, user_nev, user_email, user_telefon, statusz) VALUES (%s, %s, %s, %s, 'pending')"
        cursor.execute(query, (idopont_id, user_nev, user_email, user_telefon))
        db.commit()

        return jsonify({"message": "Foglalás sikeresen elküldve!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if db:
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
#region Elérhető időpontok Megjelenítés adminnak:
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
#region Felhsználók számára látható szabad időpontok lekérdezése



from datetime import datetime, timedelta

@app.route('/api/available-slots', methods=['GET'])
def get_available_slots():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        print("API hívás érkezett: /api/available-slots")

        # SQL lekérdezés az admin által megadott időpontokra
        cursor.execute("""
            SELECT a.datum, a.startTime, a.endTime 
            FROM availability a
            WHERE NOT EXISTS (
                SELECT 1 FROM appointment ap
                WHERE ap.datum = a.datum 
                AND ap.kezdIdo = a.startTime
                AND ap.megerosit != -1
            )
        """)

        available_slots = {}
        for row in cursor.fetchall():
            datum = row['datum'].strftime('%Y-%m-%d') if 'datum' in row and row['datum'] else None
            start_time = str(row['startTime']).split('.')[0]  # Eltávolítjuk a mikromásodpercet
            end_time = str(row['endTime']).split('.')[0]  # Eltávolítjuk a mikromásodpercet

            # Helyes időformátum biztosítása (csak HH:MM)
            start_time = datetime.strptime(start_time, "%H:%M:%S").strftime("%H:%M")
            end_time = datetime.strptime(end_time, "%H:%M:%S").strftime("%H:%M")

            if not datum or not start_time or not end_time:
                continue  # Ha nincs megfelelő adat, kihagyjuk

            # Az elérhető időpontokat JSON formátumba rakjuk
            if datum not in available_slots:
                available_slots[datum] = []
            available_slots[datum].append({
                "startTime": start_time,
                "endTime": end_time
            })

        return jsonify(available_slots), 200

    except Exception as e:
        print("Hiba történt az API-ban:", str(e))  # Debugging print
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        db.close()





if __name__ == '__main__':
    app.run(debug=True)
