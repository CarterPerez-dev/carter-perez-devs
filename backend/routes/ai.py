# backend/routes/ai.py
import logging
from flask import Blueprint, request, jsonify, Response
from helpers.ai_assistant import AIAssistant
from helpers.rate_limiter import limiter

logger = logging.getLogger(__name__)


ai_bp = Blueprint('ai_bp', __name__)


assistant = AIAssistant()

@ai_bp.route('/ask_about_me', methods=['POST'])
@limiter.limit("10 per minute")  s
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
        if stream_requested:
            def generate():
                for chunk in assistant.ask_about_portfolio(question, stream=True):
                    yield chunk
            return Response(generate(), mimetype='text/plain')
        else:
            answer = assistant.ask_about_portfolio(question, stream=False)
            logger.debug(f"Non-streaming answer: {answer}")
            return jsonify({"answer": answer})
    except Exception as e:
        logger.error(f"Error generating answer: {str(e)}")
        return jsonify({"error": "Failed to generate answer."}), 500

@ai_bp.route('/generate', methods=['POST'])
@limiter.limit("5 per minute") 
def generate_content():
    """
    POST /generate
    Body: {
      "type": "code|idea|story",
      "prompt": "description of what to generate",
      "stream": true or false (optional)
    }
    """
    data = request.get_json() or {}
    content_type = data.get('type')
    prompt = data.get('prompt')
    stream_requested = data.get('stream', False)

    if not content_type or not prompt:
        logger.error("Missing required fields in request body.")
        return jsonify({"error": "Missing 'type' or 'prompt' field."}), 400

    if content_type not in ['code', 'idea', 'story']:
        logger.error(f"Invalid content type: {content_type}")
        return jsonify({"error": "Invalid 'type'. Must be one of: code, idea, story"}), 400

    try:
        if stream_requested:
            def generate():
                for chunk in assistant.generate_content(content_type, prompt, stream=True):
                    yield chunk
            return Response(generate(), mimetype='text/plain')
        else:
            content = assistant.generate_content(content_type, prompt, stream=False)
            logger.debug(f"Generated content: {content[:100]}...")
            return jsonify({"content": content})
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        return jsonify({"error": "Failed to generate content."}), 500

@ai_bp.route('/explain', methods=['POST'])
@limiter.limit("15 per minute")
def explain_concept():
    """
    POST /explain
    Body: {
      "concept": "concept to explain",
      "stream": true or false (optional)
    }
    """
    data = request.get_json() or {}
    concept = data.get('concept')
    stream_requested = data.get('stream', False)

    if not concept:
        logger.error("No 'concept' provided in request body.")
        return jsonify({"error": "Missing 'concept' field."}), 400

    try:
        if stream_requested:
            def generate():
                for chunk in assistant.explain_concept(concept, stream=True):
                    yield chunk
            return Response(generate(), mimetype='text/plain')
        else:
            explanation = assistant.explain_concept(concept, stream=False)
            logger.debug(f"Explanation: {explanation[:100]}...")
            return jsonify({"explanation": explanation})
    except Exception as e:
        logger.error(f"Error generating explanation: {str(e)}")
        return jsonify({"error": "Failed to generate explanation."}), 500

@ai_bp.route('/translate', methods=['POST'])
@limiter.limit("20 per minute")
def translate_text():
    """
    POST /translate
    Body: {
      "text": "text to translate",
      "language": "target language",
      "stream": true or false (optional)
    }
    """
    data = request.get_json() or {}
    text = data.get('text')
    language = data.get('language')
    stream_requested = data.get('stream', False)

    if not text or not language:
        logger.error("Missing required fields in request body.")
        return jsonify({"error": "Missing 'text' or 'language' field."}), 400

    try:
        if stream_requested:
            def generate():
                for chunk in assistant.translate_text(text, language, stream=True):
                    yield chunk
            return Response(generate(), mimetype='text/plain')
        else:
            translation = assistant.translate_text(text, language, stream=False)
            logger.debug(f"Translation: {translation[:100]}...")
            return jsonify({"translation": translation})
    except Exception as e:
        logger.error(f"Error generating translation: {str(e)}")
        return jsonify({"error": "Failed to generate translation."}), 500
