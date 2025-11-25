import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# This file wraps the LLM calls.
# It will use OpenAI if OPENAI_API_KEY is set.
# Otherwise, it returns a reasonable placeholder string so you can test locally.

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY") or None

# Try to import OpenAI client lazily (not required for local testing)
client = None
if OPENAI_API_KEY:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
    except Exception:
        client = None


def generate_section(topic, section_title):
    """
    Generate section text for given topic and section title.
    If a real API key is available it will call the model; otherwise returns a placeholder.
    """
    prompt = f"Write a professional, informative business-document section (150-220 words).\nTopic: {topic}\nSection: {section_title}\nTone: professional, clear, concise."

    # if client is available, call model
    if client:
        try:
            resp = client.responses.create(
                model="gpt-4o-mini",
                input=prompt,
            )
            # different libraries return text differently; be defensive
            if hasattr(resp, "output_text"):
                return resp.output_text
            if isinstance(resp, dict) and "output" in resp:
                return resp["output"]
            # fallback: str(resp)
            return str(resp)
        except Exception as e:
            # on any LLM error, return fallback text
            print("LLM call failed:", e)
            pass

    # fallback placeholder when API not configured
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    return (f"({now} — placeholder) {section_title}\n\n"
            f"This is a generated placeholder for '{section_title}' on topic '{topic}'. "
            "Replace with real LLM output by setting OPENAI_API_KEY in your .env file.")


def refine_content(existing_text, instruction):
    prompt = f"Refine the following content according to instruction: {instruction}\n\nContent:\n{existing_text}"

    if client:
        try:
            resp = client.responses.create(
                model="gpt-4o-mini",
                input=prompt,
            )
            if hasattr(resp, "output_text"):
                return resp.output_text
            if isinstance(resp, dict) and "output" in resp:
                return resp["output"]
            return str(resp)
        except Exception as e:
            print("LLM refine failed:", e)
            pass

    # fallback: simple heuristic refine
    return f"{existing_text}\n\n[Refined with instruction: {instruction}]"
