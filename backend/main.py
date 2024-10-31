from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_db_connection

# main.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_db_connection  # Importáljuk az adatbázis kapcsolatot

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Új végpont név hozzáadásához
@app.route('/api/add-name', methods=['POST'])
def add_name():
    data = request.get_json()
    name = data.get('name')  # Az elküldött név
    
    if not name:
        return jsonify({"error": "Name is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO test_names (name) VALUES (%s)", (name,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Name added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
