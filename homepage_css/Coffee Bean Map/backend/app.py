import psycopg2
from flask import Flask, jsonify

app = Flask(__name__)

# Function to connect to PostgreSQL database
def get_db_connection():
    conn = psycopg2.connect(
        host="127.0.0.1:5000",
        database="coffee_db",
        user="barry",
        password="postgres"
    )
    return conn

# API route to fetch coffee data
@app.route('/api/coffee-data')
def coffee_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM coffee_db') 
    coffee_data = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # Convert the data to a list of dictionaries
    coffee_list = []
    for row in coffee_data:
        coffee_list.append({
            'region': row[0],  # Adjust to table's columns
            'latitude': row[1],
            'longitude': row[2],
            'flavor': row[3]
        })
    
    return jsonify(coffee_list)

if __name__ == "__main__":
    app.run(debug=True)
