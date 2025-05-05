# backend/app.py
from flask import Flask
from flask_socketio import SocketIO
from dotenv import load_dotenv
from flask_cors import CORS
from flask_session import Session
import os
import logging
from flask import request, jsonify
from routes.portfolio import portfolio_bp
from routes.ai import ai_bp
from helpers.rate_limiter import configure_limiter


load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


limiter = configure_limiter(app)


limiter.limit("30 per minute")(ai_bp)
limiter.limit("60 per minute")(portfolio_bp)

app.register_blueprint(portfolio_bp, url_prefix='/portfolio')
app.register_blueprint(ai_bp, url_prefix='/ai')

@app.before_request
def log_request_info():
    logger.info(f"Handling request to {request.path} with method {request.method}")
    
    
@socketio.on('connect')
def handle_connect():
    logger.info('Client connected')
    socketio.emit('message', {'data': 'Connected to server'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
