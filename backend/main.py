from flask import Flask, request, jsonify, g
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta
import mysql.connector
from flask_mail import Mail, Message
import os
from werkzeug.utils import secure_filename
from flask import send_from_directory
import threading
import time


app = Flask(__name__)

# Flask-CORS konfiguráció
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Flask titkos kulcs a JWT-hez
app.config['SECRET_KEY'] = 'Abcfeskakasdkdayxc342dasd3'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)






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
        cursor = db.cursor(dictionary=True)

        # 📌 Ellenőrizzük, hogy az időpont létezik-e
        cursor.execute("""
            SELECT datum, kezdes_ido, vege_ido, idopont_tipus
            FROM idopontok 
            WHERE id = %s
        """, (idopont_id,))
        idopont = cursor.fetchone()

        if not idopont:
            return jsonify({"error": "A kiválasztott időpont nem található."}), 404

        # 📌 Foglalás mentése az adatbázisba
        cursor.execute("""
            INSERT INTO foglalasok (idopont_id, user_nev, user_email, user_telefon, statusz)
            VALUES (%s, %s, %s, %s, 'pending')
        """, (idopont_id, user_nev, user_email, user_telefon))
        db.commit()

        # 📧 Email küldése a felhasználónak
        subject = "Foglalás rögzítve leadva"
        body = f"Kedves {user_nev},\n\nFoglalásod sikeresen rögzítettük!\n\n📅 Időpont: {idopont['datum']} {idopont['kezdes_ido']} - {idopont['vege_ido']}\n📝 Tanfolyam típusa: {idopont['idopont_tipus']}\n\nIdőpontod hamarosan feldolgozásra kerül.\n\nKöszönjük a jelentkezésedet!"

        msg = Message(subject, recipients=[user_email])
        msg.body = body
        mail.send(msg)

        return jsonify({"message": "Foglalás sikeresen létrehozva, email elküldve!"}), 201

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
        return jsonify({"error": "Érvénytelen foglalás ID"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        # Foglalás adatainak lekérdezése
        cursor.execute("""
            SELECT f.user_email, f.user_nev, i.datum, i.kezdes_ido, i.vege_ido, i.idopont_tipus
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            WHERE f.id = %s
        """, (foglalId,))
        foglalas = cursor.fetchone()

        if not foglalas:
            return jsonify({"error": "Foglalás nem található"}), 404

        # Foglalás státusz frissítése
        cursor.execute("UPDATE foglalasok SET statusz = 'confirmed' WHERE id = %s", (foglalId,))
        db.commit()

        # 📧 Email küldése a felhasználónak
        subject = "Foglalás megerősítve"
        body = f"Kedves {foglalas['user_nev']},\n\nFoglalásod sikeresen megerősítésre került!\n\n📅 Időpont: {foglalas['datum']} {foglalas['kezdes_ido']} - {foglalas['vege_ido']}\n📝 Tanfolyam típusa: {foglalas['idopont_tipus']}\n\nVárunk szeretettel!\n\n\n Helyszín: OxyFitt \n Timur utca 103 1162 OxyFitt Második emelt "
        
        msg = Message(subject, recipients=[foglalas["user_email"]])
        msg.body = body
        mail.send(msg)

        return jsonify({"message": "Foglalás megerősítve, email elküldve!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()



@app.route('/api/admin/foglalas_elutasitas', methods=['POST'])
def reject_foglalas():
    data = request.json
    foglalId = data.get("foglalId")

    if not foglalId:
        return jsonify({"error": "Érvénytelen foglalás ID"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        # Foglalás adatainak lekérdezése
        cursor.execute("""
            SELECT f.user_email, f.user_nev, i.datum, i.idopont_tipus
            FROM foglalasok f
            JOIN idopontok i ON f.idopont_id = i.id
            WHERE f.id = %s
        """, (foglalId,))
        foglalas = cursor.fetchone()

        if not foglalas:
            return jsonify({"error": "Foglalás nem található"}), 404

        # Foglalás törlése
        cursor.execute("DELETE FROM foglalasok WHERE id = %s", (foglalId,))
        db.commit()

        # 📧 Email küldése a felhasználónak
        subject = "Foglalás elutasítva"
        body = f"Kedves {foglalas['user_nev']},\n\nSajnálattal értesítünk, hogy foglalásod elutasításra került.\n\n📅 Időpont: {foglalas['datum']}\n📝 Tanfolyam típusa: {foglalas['idopont_tipus']}\n\nHa kérdésed van, vedd fel velünk a kapcsolatot."

        msg = Message(subject, recipients=[foglalas["user_email"]])
        msg.body = body
        mail.send(msg)

        return jsonify({"message": "Foglalás elutasítva, email elküldve!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()



#region Admin Képzés 
@app.route('/api/admin/kepzesek', methods=['POST'])
def add_kepzes():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        # Ellenőrizzük, hogy minden adat megvan-e
        cim = request.form.get('cim')
        leiras = request.form.get('leiras')
        file = request.files.get('kep')

        if not cim or not leiras:
            return jsonify({"error": "Hiányzó adatok"}), 400

        # Ha van kép, mentés a szerverre
        kep_nev = None
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            kep_nev = filename  # Csak a fájlnevet tároljuk az adatbázisban

        # Adatok mentése MySQL-be
        cursor.execute("""
            INSERT INTO kepzesek (cim, leiras, kep) 
            VALUES (%s, %s, %s)
        """, (cim, leiras, kep_nev))
        db.commit()

        return jsonify({"message": "Képzés sikeresen hozzáadva!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()



@app.route('/api/kepzesek', methods=['GET'])
def get_kepzesek():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM kepzesek ORDER BY id DESC")
        kepzesek = cursor.fetchall()

        return jsonify(kepzesek)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()



@app.route('/api/admin/kepzesek/<int:id>', methods=['DELETE'])
def delete_kepzes(id):
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Ellenőrizzük, hogy létezik-e a képzés
        cursor.execute("SELECT kep FROM kepzesek WHERE id = %s", (id,))
        kepzes = cursor.fetchone()

        if not kepzes:
            return jsonify({"error": "A képzés nem található!"}), 404

        # Töröljük a képet a szerverről, ha van
        if kepzes['kep']:
            kep_path = os.path.join(app.config['UPLOAD_FOLDER'], kepzes['kep'])
            if os.path.exists(kep_path):
                os.remove(kep_path)

        # Képzés törlése az adatbázisból
        cursor.execute("DELETE FROM kepzesek WHERE id = %s", (id,))
        db.commit()

        return jsonify({"message": "Képzés sikeresen törölve!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()



#region multbeli idopontok torlese automatikusan

def torold_lejart_foglalasokat():
    while True:
        try:
            with app.app_context():  # 🟢 Flask kontextus létrehozása
                db = get_db_connection()
                cursor = db.cursor()
                
                # 🟢 Minden múltbeli időpont és foglalás törlése
                cursor.execute("DELETE FROM foglalasok WHERE idopont_id IN (SELECT id FROM idopontok WHERE datum < CURDATE())")
                cursor.execute("DELETE FROM idopontok WHERE datum < CURDATE()")

                db.commit()
                cursor.close()
                db.close()
                print("[INFO] Lejárt foglalások és időpontok törölve.")

        except Exception as e:
            print("[HIBA] Nem sikerült törölni a múltbeli foglalásokat:", str(e))

        time.sleep(86400)  # 24 óránként fusson

# 🟢 Indításkor azonnal végrehajt egy törlést


def start_background_task():
    thread = threading.Thread(target=torold_lejart_foglalasokat, daemon=True)
    thread.start()




if __name__ == '__main__':
    start_background_task()
    app.run(debug=True)
