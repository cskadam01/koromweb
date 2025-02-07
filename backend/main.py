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
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
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
        cursor.execute("""
            SELECT 
                i.id, 
                i.datum, 
                TIME_FORMAT(i.kezdes_ido, '%H:%i') AS kezdes_ido,
                TIME_FORMAT(i.vege_ido, '%H:%i') AS vege_ido,
                i.max_ferohely,
                i.idopont_tipus,
                COALESCE((SELECT COUNT(*) FROM foglalasok WHERE foglalasok.idopont_id = i.id AND foglalasok.statusz = 'confirmed'), 0) AS foglaltHelyek,
                COALESCE((SELECT COUNT(*) FROM foglalasok WHERE foglalasok.idopont_id = i.id AND foglalasok.statusz = 'pending'), 0) AS pendingHelyek
            FROM idopontok i
            ORDER BY i.datum ASC
        """)
        idopontok = cursor.fetchall()
        
        return jsonify(idopontok)
    except Exception as e:
        print("Hiba az idopontok lekérdezésekor:", str(e))  # Debug üzenet
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()




# 🔹 2. API: Új időpont hozzáadása
@app.route('/api/admin/idopontok', methods=['POST'])
def add_idopont():
    db = get_db_connection()
    cursor = db.cursor()
    try:
        data = request.json
        datum = data.get('datum')
        kezdes_ido = data.get('kezdes_ido')
        vege_ido = data.get('vege_ido')
        max_ferohely = data.get('max_ferohely')
        idopont_tipus = data.get('idopont_tipus', 'Általános tanfolyam')

        if not datum or not max_ferohely or not idopont_tipus:
            return jsonify({"error": "Hiányzó adatok"}), 400

        cursor.execute("""
            INSERT INTO idopontok (datum, kezdes_ido, vege_ido, max_ferohely, idopont_tipus)
            VALUES (%s, %s, %s, %s, %s)
        """, (datum, kezdes_ido, vege_ido, max_ferohely, idopont_tipus))

        db.commit()
        return jsonify({"message": "Időpont sikeresen létrehozva!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

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


@app.route('/api/admin/foglalasok', methods=['GET'])
def get_admin_foglalasok():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT f.foglalId, f.idopont_id, f.user_nev, f.user_email, f.user_telefon, i.datum, i.kezdes_ido, i.vege_ido
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            WHERE f.statusz = 'pending'
        """)
        pending = cursor.fetchall()

        cursor.execute("""
            SELECT f.foglalId, f.idopont_id, f.user_nev, f.user_email, f.user_telefon, i.datum, i.kezdes_ido, i.vege_ido
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            WHERE f.statusz = 'confirmed'
        """)
        confirmed = cursor.fetchall()

        return jsonify({"pending": pending, "confirmed": confirmed})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route('/api/admin/foglalasok', methods=['POST'])
def update_foglalas():
    data = request.json
    foglalId = data.get("foglalId")
    action = data.get("action")

    if not foglalId or action not in ["confirm", "reject"]:
        return jsonify({"error": "Érvénytelen kérés"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    try:
        if action == "confirm":
            cursor.execute("UPDATE foglalasok SET statusz = 'confirmed' WHERE foglalId = %s", (foglalId,))
            message = "Foglalás megerősítve"
        elif action == "reject":
            cursor.execute("DELETE FROM foglalasok WHERE foglalId = %s", (foglalId,))
            message = "Foglalás elutasítva"

        db.commit()

        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()


#region Admin felület, Függő foglalások
@app.route('/api/admin/pending_foglalasok', methods=['GET'])
def get_pending_foglalasok():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT f.id AS foglalId, f.idopont_id, f.user_nev, f.user_email, f.user_telefon, 
                   i.datum, 
                   TIME_FORMAT(i.kezdes_ido, '%H:%i') AS kezdes_ido,
                   TIME_FORMAT(i.vege_ido, '%H:%i') AS vege_ido,
                   COALESCE(i.idopont_tipus, 'Nincs megadva') AS idopont_tipus
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            WHERE f.statusz = 'pending'
        """)
        pending = cursor.fetchall()
        return jsonify(pending)
    except Exception as e:
        print("Hiba a pending foglalások lekérdezésekor:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route('/api/admin/confirmed_foglalasok', methods=['GET'])
def get_confirmed_foglalasok():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT f.id AS foglalId, f.idopont_id, f.user_nev, f.user_email, f.user_telefon, 
                   i.datum, 
                   TIME_FORMAT(i.kezdes_ido, '%H:%i') AS kezdes_ido,
                   TIME_FORMAT(i.vege_ido, '%H:%i') AS vege_ido,
                   COALESCE(i.idopont_tipus, 'Nincs megadva') AS idopont_tipus
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            WHERE f.statusz = 'confirmed'
        """)
        confirmed = cursor.fetchall()
        return jsonify(confirmed)
    except Exception as e:
        print("Hiba a confirmed foglalások lekérdezésekor:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route('/api/admin/foglalas_megerosites', methods=['POST'])
def confirm_foglalas():
    data = request.json
    foglalId = data.get("foglalId")

    if not foglalId:
        return jsonify({"error": "Érvénytelen kérés"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("UPDATE foglalasok SET statusz = 'confirmed' WHERE id = %s", (foglalId,))
        db.commit()
        return jsonify({"message": "Foglalás megerősítve"}), 200
    except Exception as e:
        print("Hiba a foglalás megerősítésekor:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()



@app.route('/api/admin/foglalas_elutasitas', methods=['POST'])
def reject_foglalas():
    data = request.json
    foglalId = data.get("foglalId")

    if not foglalId:
        return jsonify({"error": "Érvénytelen kérés"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM foglalasok WHERE id = %s", (foglalId,))
        db.commit()
        return jsonify({"message": "Foglalás elutasítva"}), 200
    except Exception as e:
        print("Hiba a foglalás elutasításakor:", str(e))  # Debugging
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()




if __name__ == '__main__':
    app.run(debug=True)
