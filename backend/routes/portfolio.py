# backend/routes/portfolio.py
import logging
from flask import Blueprint, request, jsonify, Response
from helpers.port import PortfolioAssistant
from helpers.rate_limiter import limiter

logger = logging.getLogger(__name__)

# Create a Blueprint instance
portfolio_bp = Blueprint('portfolio_bp', __name__)

# Instantiate the assistant
assistant = PortfolioAssistant()

@portfolio_bp.route('/ask_about_me', methods=['POST'])
@limiter.limit("15 per minute")  # Portfolio routes can have slightly higher limits
def ask_about_me():
    """
    POST /ask_about_me
    Body: {
      "question": "some question about Carter",
      "stream": true or false (optional)
    }
    """
    data = request.get_json() or {}
    question = data.get('question')
    stream_requested = data.get('stream', False)

    if not question:
        logger.error("No 'question' provided in request body.")
        return jsonify({"error": "Missing 'question' field."}), 400

    try:
        # Handle streaming vs. non-streaming
        if stream_requested:
            def generate():
                for chunk in assistant.ask_about_me(question, stream=True):
                    yield chunk
            return Response(generate(), mimetype='text/plain')
        else:
            answer = assistant.ask_about_me(question, stream=False)
            logger.debug(f"Non-streaming answer: {answer}")
            return jsonify({"answer": answer})
    except Exception as e:
        logger.error(f"Error generating answer: {str(e)}")
        return jsonify({"error": "Failed to generate answer."}), 500
