from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import LSTM, Bidirectional, TextVectorization

# Load the model
model = load_model("C:/Users/abhij/OneDrive/Attachments/Desktop/Projects/Comment-Toxicity/backend/flask-model-api/toxicity.h5")


#
MAX_FEATURES = 200000
MAXLEN = 1800  

vectorizer = TextVectorization(
    max_tokens=MAX_FEATURES,
    output_sequence_length=MAXLEN,
    output_mode='int'
)

#  re-adapting vectorizer!
import pandas as pd
df = pd.read_csv('C:/Users/abhij/OneDrive/Attachments/Desktop/Projects/Comment-Toxicity/backend/flask-model-api/train.csvv')

X = df['comment_text']
vectorizer.adapt(X.values)  

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'comment' not in data:
        return jsonify({'error': 'No comment provided'}), 400

    comment = data['comment']

    vectorized_comment = vectorizer([comment])  
    predictions = model.predict(vectorized_comment)[0]

    categories = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
    results = {category: bool(pred > 0.5) for category, pred in zip(categories, predictions)}

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
