# Stockify Dashboard Backend

This is the backend API for the Stockify Dashboard application. It provides endpoints to access data from the MySQL database.

## Setup Instructions

### Prerequisites
- Python 3.8+
- MySQL Server

### Installation

1. Install required Python packages:
```
pip install flask flask-cors mysql-connector-python
```

2. Setup the database:
```
python setup_db.py
```

3. Run the Flask application:
```
python app.py
```

The server will start at http://localhost:5000

## API Endpoints

- GET /api/entree-stock - Returns all inventory entries
- GET /api/sorties-stock - Returns all inventory exits
- GET /api/paiements-clients - Returns all client payments
- GET /api/paiements-fournisseurs - Returns all supplier payments
