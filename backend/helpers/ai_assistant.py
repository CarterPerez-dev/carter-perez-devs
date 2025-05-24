# ai_assistant.py
import os
import logging
from API.AI import client

logger = logging.getLogger(__name__)

class AIAssistant:
    def __init__(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        
        portfolio_file_path = os.path.join(dir_path, "about_me.txt")
        with open(portfolio_file_path, "r", encoding="utf-8") as f:
            self.portfolio_data = f.read()

        logger.info("AIAssistant initialized. Portfolio data length: %d", len(self.portfolio_data))

    def ask_about_portfolio(self, question, stream=False):
        """
        Answer questions about the portfolio/resume data
        """
        system_message = (
            "You are an AI assistant who knows everything about Carter. "
            "Use the following info to answer any questions about me:\n\n"
            f"{self.portfolio_data}\n\n"
            "Answer concisely make up info using the context from the text if not provided above. "
            "So if the info is not in the text about me, make it up relative to what you might think is true based on the text "
            "using context from about_text, So if there are yes or no answers, answer yes to things that present me in a good light, "
            "and no for anything that presents me in a bad light. Make sure you answer any question that is asked whether you know the answer or not- "
            "if you do not know the answer then make something up."
        )

        if stream:
            return self._streaming_response(system_message, question)
        else:
            return self._single_response(system_message, question)

    def generate_content(self, content_type, prompt, stream=False):
        """
        Generate various types of content based on the request type
        """
        system_message = ""
        
        if content_type == "code":
            system_message = (
                "You are an expert programming assistant. Generate high-quality, working code "
                "based on the user's request. Include helpful comments and follow best practices. "
                "Format your response as clean, well-structured code without any additional explanations."
            )
        elif content_type == "idea":
            system_message = (
                "You are a project idea generator specialized in cybersecurity and software development. "
                "Generate a detailed project idea based on the keywords provided. Include a title, description, "
                "suggested technologies, and implementation steps. Focus on practical, innovative projects "
                "that could showcase a developer's skills in a portfolio."
            )
        elif content_type == "story":
            system_message = (
                "You are a creative writing assistant specializing in brief cyber-themed short stories. "
                "Create an engaging, cyberpunk-style short story based on the provided prompt. "
                "Keep the story concise (under 500 words) but impactful, with a clear beginning, middle, and end. "
                "Focus on themes like technology, artificial intelligence, hacking, or digital worlds."
            )
        else:
            logger.warning(f"Unknown content type: {content_type}")
            return "I don't know how to generate content of type '{content_type}'"

        if stream:
            return self._streaming_response(system_message, prompt)
        else:
            return self._single_response(system_message, prompt)

    def explain_concept(self, concept, stream=False):
        """
        Explain technical or cybersecurity concepts
        """
        system_message = (
            "You are an educational assistant specializing in cybersecurity and technology concepts. "
            "Provide clear, concise, and accurate explanations of technical concepts. "
            "Structure your explanation with a definition, how it works, why it's important, "
            "and examples when appropriate. Focus on making complex topics accessible "
            "without oversimplifying critical details."
        )

        if stream:
            return self._streaming_response(system_message, f"Explain the concept of {concept}")
        else:
            return self._single_response(system_message, f"Explain the concept of {concept}")

    def translate_text(self, text, target_language, stream=False):
        """
        Translate text to the specified language
        """
        system_message = (
            f"You are a language translation assistant. Translate the provided text accurately into {target_language}. "
            f"Maintain the meaning, tone, and intent of the original text as closely as possible. "
            f"Only return the translated text without any additional explanation."
        )

        if stream:
            return self._streaming_response(system_message, f"Translate this to {target_language}: {text}")
        else:
            return self._single_response(system_message, f"Translate this to {target_language}: {text}")

    def _single_response(self, system_message, user_question):
        try:
            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_question}
                ],
                max_tokens=750,
                temperature=0.7
            )
            answer = res.choices[0].message.content.strip()
            logger.debug("Single-response answer: %s", answer)
            return answer
        except Exception as e:
            logger.error("Error generating single response: %s", e)
            raise

    def _streaming_response(self, system_message, user_question):
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_question}
                ],
                max_tokens=750,
                temperature=0.7,
                stream=True
            )
            for chunk in response:
                if chunk.choices:
                    delta = chunk.choices[0].delta
                    chunk_content = getattr(delta, "content", None)
                    if chunk_content:
                        yield chunk_content
        except Exception as e:
            logger.error("Error during streaming: %s", str(e))
            yield f"[Error during streaming: {str(e)}]"
