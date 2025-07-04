# Main Flask application entry point
# Add your Flask app initialization and routes here

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Import your route modules
# from routes.order_routes import order_bp
# from routes.prediction_routes import prediction_bp

# Register blueprints
# app.register_blueprint(order_bp, url_prefix='/api')
# app.register_blueprint(prediction_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)