from flask import Blueprint, jsonify, request
import mysql.connector

bp = Blueprint('provinces', __name__)
 
@bp.route('/api/provinces', methods=['GET'])
def get_provinces():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='ladmin61',
            database='immat'
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT DISTINCT province FROM provinces WHERE province IS NOT NULL AND province <> ''")
        provinces = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(provinces), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/api/villes', methods=['GET'])
def get_villes_by_province():
    province = request.args.get('province')
    if not province:
        return jsonify({'error': 'Missing province parameter'}), 400
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='ladmin61',
            database='immat'
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT DISTINCT ville FROM provinces WHERE province = %s AND ville IS NOT NULL AND ville <> ''",
            (province,)
        )
        villes = [row['ville'] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify(villes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500