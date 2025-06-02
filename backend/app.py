from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from models import db, Motorcycle,User  # <-- Import db and Motorcycle model
from datetime import datetime
from dateutil import parser
# Initialize Flask app and CORS (only one call needed)
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins
CORS(app, supports_credentials=True)
# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:ladmin61@127.0.0.1/immat'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True  # Logs all SQL statements
app.config['DEBUG'] = True

# Initialize the db object
db.init_app(app)

# Create all tables (if they don't exist)
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return "Flask backend is running!"

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    # Replace with your actual authentication logic
    if email == 'user@example.com' and password == 'password123':
        # Optionally set a session or token here
        return jsonify({"success": True}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


# Route for fetching all motorcycles
@app.route('/immatric', methods=['GET'])
def get_all_motorcycles():
    try:
        motorcycles = Motorcycle.query.all()
        result = [
            {
                "FrameNumber": m.FrameNumber,
                "Marque": m.Marque,
                "DateArrivage": m.DateArrivage,
                "MODELE": m.MODELE,
                "NFacture": m.NFacture,
                "Color": m.Color,
                "revendeur": m.revendeur,
                "client": m.client,
                "DateVenteRevendeur": m.DateVenteRevendeur,
                "DateVenteClient": m.DateVenteClient,
                "cnie": m.cnie,
                "observation": m.observation,
                "DateNaissance": m.DateNaissance,
                "Sexe": m.Sexe,
                "VilleVente": m.VilleVente,
                "ProvinceVente": m.ProvinceVente,
                "VilleAffectation": m.VilleAffectation,
                "ProvinceAffectation": m.ProvinceAffectation
            } for m in motorcycles
        ]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for fetching a motorcycle by FrameNumber
@app.route('/immatric/<string:framenumber>', methods=['GET'])
def get_motorcycle_by_framenumber(framenumber):
    motorcycle = Motorcycle.query.filter_by(FrameNumber=framenumber).first()
    if motorcycle is None:
        return jsonify({"error": "Motorcycle not found"}), 404
    return jsonify({
        "FrameNumber": motorcycle.FrameNumber,
        "Marque": motorcycle.Marque,
        "DateArrivage": motorcycle.DateArrivage,
        "MODELE": motorcycle.MODELE,
        "NFacture": motorcycle.NFacture,
        "Color": motorcycle.Color,
        "revendeur": motorcycle.revendeur,
        "client": motorcycle.client,
        "DateVenteRevendeur": motorcycle.DateVenteRevendeur,
        "DateVenteClient": motorcycle.DateVenteClient,
        "cnie": motorcycle.cnie,
        "observation": motorcycle.observation,
        "DateNaissance": motorcycle.DateNaissance,
        "Sexe": motorcycle.Sexe,
        "VilleVente": motorcycle.VilleVente,
        "ProvinceVente": motorcycle.ProvinceVente,
        "VilleAffectation": motorcycle.VilleAffectation,
        "ProvinceAffectation": motorcycle.ProvinceAffectation,
    })

# Route for adding motorcycles
@app.route('/api/motorcycles', methods=['POST'])
def add_motorcycles():
    try:
        motorcycles_data = request.get_json()

        if not motorcycles_data:
            return jsonify({"error": "No data provided"}), 400

        if isinstance(motorcycles_data, dict):
            motorcycles_data = [motorcycles_data]

        def empty_to_none(value):
            return value if value not in ("", None) else None

        for data in motorcycles_data:
            motorcycle = Motorcycle(
                FrameNumber=data.get('FrameNumber'),
                Marque=data.get('Marque'),
                DateArrivage=empty_to_none(data.get('DateArrivage')),
                MODELE=data.get('MODELE'),
                NFacture=data.get('NFacture'),
                Color=data.get('Color'),
                revendeur=data.get('revendeur'),
                client=data.get('client'),
                DateVenteRevendeur=empty_to_none(data.get('DateVenteRevendeur')),
                DateVenteClient=empty_to_none(data.get('DateVenteClient')),
                cnie=data.get('cnie'),
                observation=data.get('observation'),
                DateNaissance=empty_to_none(data.get('DateNaissance')),
                Sexe=data.get('Sexe'),
                VilleVente=data.get('VilleVente'),
                ProvinceVente=data.get('ProvinceVente'),
                VilleAffectation=data.get('VilleAffectation'),
                ProvinceAffectation=data.get('ProvinceAffectation')
            )
            db.session.add(motorcycle)

        db.session.commit()
        app.logger.info("Motorcycles saved successfully")
        return jsonify({"message": "Motorcycles added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error saving motorcycles: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/motorcycles/<string:framenumber>', methods=['PUT'])
def update_motorcycle(framenumber):
    try:
        data = request.json
        print(f"Received data: {data}")  # Debug log
        
        # Handle date fields
        date_fields = ['DateArrivage', 'DateVenteRevendeur', 'DateVenteClient', 'DateNaissance']
        for field in date_fields:
            try:
                if data.get(field):
                    # Convert from DD/MM/YY to YYYY-MM-DD
                    try:
                        date_obj = parser.parse(data[field])
                        data[field] = date_obj.strftime('%d/%m/%y')
                    except (ValueError, TypeError) as e:
                        print(f"Error parsing date: {e}")
                        date_obj = datetime.strptime(data[field], '%d/%m/%y')
                        data[field] = date_obj.strftime('%Y-%m-%d')
                else:
                    data[field] = None
            except ValueError as e:
                print(f"Date conversion error for {field}: {str(e)}")  # Debug log
                return jsonify({"error": f"Invalid date format for {field}. Expected DD/MM/YY"}), 400
        
        motorcycle = Motorcycle.query.filter_by(FrameNumber=framenumber).first()
        if not motorcycle:
            return jsonify({"error": "Motorcycle not found"}), 404

        # Update fields
        for key, value in data.items():
            setattr(motorcycle, key, value)

        db.session.commit()
        return jsonify({"message": "Motorcycle updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating motorcycle: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 500

# Start the server
if __name__ == '__main__':
    app.run(port=5000, debug=True)
