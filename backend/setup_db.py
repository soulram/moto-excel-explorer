import mysql.connector
from mysql.connector import Error
import mysql.connector

# --- Your MySQL connection ---
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'ladmin61'
}

# --- Connect to MySQL ---
connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()

# --- Create database if it doesn't exist ---
cursor.execute("CREATE DATABASE IF NOT EXISTS immat")
print("✅ Database 'immat' checked/created.")

# --- Connect to the 'immat' database now ---
connection.database = 'immat'

# --- Create table 'immatric' if it doesn't exist ---
cursor.execute("""
CREATE TABLE IF NOT EXISTS immatric (
    FrameNumber VARCHAR(50) DEFAULT NULL,
    Marque VARCHAR(30) DEFAULT NULL,
    DateArrivage DATE DEFAULT NULL,
    MODELE VARCHAR(50) DEFAULT NULL,
    NFacture VARCHAR(20) DEFAULT NULL,
    Color VARCHAR(30) DEFAULT NULL,
    revendeur VARCHAR(50) DEFAULT NULL,
    client VARCHAR(50) DEFAULT NULL,
    DateVenteRevendeur DATE DEFAULT NULL,
    DateVenteClient DATE DEFAULT NULL,
    cnie VARCHAR(20) DEFAULT NULL,
    observation VARCHAR(100) DEFAULT NULL,
    DateNaissance DATE DEFAULT NULL,
    Sexe VARCHAR(7) DEFAULT NULL,
    VilleVente VARCHAR(50) DEFAULT NULL,
    ProvinceVente VARCHAR(50) DEFAULT NULL,
    VilleAffectation VARCHAR(50) DEFAULT NULL,
    ProvinceAffectation VARCHAR(50) DEFAULT NULL
)
""")
print("✅ Table 'immatric' checked/created.")

# --- Clean up ---
cursor.close()
connection.close()
print("✅ Setup finished.")
