# backend/helpers/rate_limiter.py
import logging
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

logger = logging.getLogger(__name__)

# Initialize limiter without binding to app yet
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per day", "20 per hour"],
    storage_uri="memory://",
    strategy="fixed-window",  
)

def configure_limiter(app):
    """Configure and attach the limiter to the Flask app"""
    limiter.init_app(app)
    

    @app.errorhandler(429)
    def ratelimit_handler(e):
        logger.warning(f"Rate limit exceeded: {get_remote_address()}")
        return {
            "error": "Rate limit exceeded",
            "message": "Too many requests. Please try again later."
        }, 429
    
        
    logger.info("Rate limiter configured with default limits: 100/day, 20/hour")
    
    return limiter
