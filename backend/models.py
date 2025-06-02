# models.py

from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

# Define the Motorcycle model based on the `immatric` table
class Motorcycle(db.Model):
    __tablename__ = 'immatric'

    # Define FrameNumber as the primary key
    FrameNumber = db.Column(db.String(50), primary_key=True)

    # Other columns
    Marque = db.Column(db.String(30))
    DateArrivage = db.Column(db.Date)
    MODELE = db.Column(db.String(50))
    NFacture = db.Column(db.String(20))
    Color = db.Column(db.String(30))
    revendeur = db.Column(db.String(50))
    client = db.Column(db.String(50))
    DateVenteRevendeur = db.Column(db.Date)
    DateVenteClient = db.Column(db.Date)
    cnie = db.Column(db.String(20))
    observation = db.Column(db.String(100))
    DateNaissance = db.Column(db.Date)
    Sexe = db.Column(db.String(7))
    VilleVente = db.Column(db.String(50))
    ProvinceVente = db.Column(db.String(50))
    VilleAffectation = db.Column(db.String(50))
    ProvinceAffectation = db.Column(db.String(50))

    def __repr__(self):
        return f"<Motorcycle {self.FrameNumber} - {self.Marque} {self.MODELE}>"

        
class User(db.Model):
    __tablename__ = 'users'

    # Define FrameNumber as the primary key
     
    nom = db.Column(db.String(25), primary_key=True)
    # Other columns
    
    login = db.Column(db.String(20))
    password = db.Column(db.String(10))
    droit = db.Column(db.String(30))
    
    def __repr__(self):
        return f"<User {self.nom} - {self.login} {self.password}>"