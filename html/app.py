from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Get database URL from environment variable
database_url = os.getenv('DATABASE_URL')

print(f'Database URL: {database_url}')

# Create the engine using the database URL from the environment variable
engine = create_engine(database_url)

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Coffee Database API!"

def get_table_data(table_name):
    session = sessionmaker(bind=engine)()
    try:
        metadata = MetaData()
        metadata.reflect(bind=engine)
        table = Table(table_name, metadata, autoload_with=engine)

        result = session.execute(table.select()).fetchall()
        column_names = table.columns.keys()
        data = [dict(zip(column_names, row)) for row in result]
    finally:
        session.close()

    return data

@app.route('/robusta_production', methods=['GET'])
def get_robusta_production_data():
    data = get_table_data('robusta_production')
    return jsonify(data)

@app.route('/green_coffee_bean_imports', methods=['GET'])
def get_green_coffee_import_data():
    data = get_table_data('green_coffee_bean_imports')
    return jsonify(data)

@app.route('/soluble_coffee_imports', methods=['GET'])
def get_soluble_coffee_import_data():
    data = get_table_data('soluble_coffee_imports')
    return jsonify(data)

@app.route('/total_coffee_imports', methods=['GET'])
def get_total_coffee_import_data():
    data = get_table_data('total_coffee_imports')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)