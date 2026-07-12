from flask import Flask, request, jsonify, render_template
import json
import random
import re

app = Flask(__name__)

# Load intents
with open('intents.json', 'r') as f:
    data = json.load(f)


def clean(text):
    """Lowercase and strip punctuation."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text


def get_response(user_input):
    user_input_clean = clean(user_input)
    user_tokens = set(user_input_clean.split())

    best_match = None
    best_score = 0

    for intent in data['intents']:
        for pattern in intent['patterns']:
            pattern_clean = clean(pattern)

            # 1) Exact substring match (strong signal)
            if pattern_clean in user_input_clean:
                return random.choice(intent['responses'])

            # 2) Token overlap score (fallback fuzzy matching)
            pattern_tokens = set(pattern_clean.split())
            overlap = len(user_tokens & pattern_tokens)
            if overlap > best_score:
                best_score = overlap
                best_match = intent

    if best_match and best_score > 0:
        return random.choice(best_match['responses'])

    return "Sorry, I didn't quite understand that. Could you rephrase, or ask about admissions, fees, courses, timings, or the library?"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    if not user_message.strip():
        return jsonify({'response': "Please type something!"})
    bot_response = get_response(user_message)
    return jsonify({'response': bot_response})


if __name__ == '__main__':
    app.run(debug=True)