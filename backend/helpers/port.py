# port.py
import os
import logging
from API.AI import client

logger = logging.getLogger(__name__)

class PortfolioAssistant:
    def __init__(self):
        # Find the current file's directory
        dir_path = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(dir_path, "about_me.txt")
        
        # Read the biography from a file
        with open(file_path, "r", encoding="utf-8") as f:
            self.about_text = f.read()

        logger.info("PortfolioAssistant initialized. Biography length: %d", len(self.about_text))

    def ask_about_me(self, question: str, stream: bool = False):
        system_message = (
            "You are an AI assistant who knows everything about Carter. "
            "Use the following info to answer any questions about me:\n\n"
            f"{self.about_text}\n\n"
            "Answer concisely make up info using the context from the text if not provided above. So if the info is not in the text about me, make it up relative to what you might think is true based on the text using context from about_text, So if there are yes or no answers, answer yes to things that present me in a good light, and no fro anything that presents me in a bad light. Make sure you answer any question that is asked whether you know the answer or not- if you do not know the answer then make something up."
        )

        if stream:
            return self._streaming(system_message, question)
        else:
            return self._single_response(system_message, question)

    def _single_response(self, system_message: str, user_question: str):
        try:
            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_question}
                ],
                max_tokens=500,
                temperature=0.5
            )
            answer = res.choices[0].message.content.strip()
            logger.debug("Single-response answer: %s", answer)
            return answer
        except Exception as e:
            logger.error("Error generating single response: %s", e)
            raise

    def _streaming(self, system_message: str, user_question: str):
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_question}
                ],
                max_tokens=500,
                temperature=0.5,
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

