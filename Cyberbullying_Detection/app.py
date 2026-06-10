import streamlit as st
import pickle
import numpy as np
import re
import nltk

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('vader_lexicon')

# 🔹 Load files
# Load files
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))
vectorizer = pickle.load(open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb"))
info = pickle.load(open(os.path.join(BASE_DIR, "info.pkl"), "rb"))

# 🔹 NLP setup
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
sia = SentimentIntensityAnalyzer()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z]", " ", text)

    words = text.split()
    words = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]

    return " ".join(words)

def get_sentiment(text):
    return sia.polarity_scores(text)['compound']

# 🔹 UI Design
st.set_page_config(page_title="Cyberbullying Detection System", layout="centered")

st.title("🛡️ AI-Powered CYBERBULLYING DETECTION SYSTEM")
st.write("NLP + Sentiment Analysis based detection model")

# 🔹 Input box
text = st.text_area("Enter your text here:", height=150)

if st.button("Analyze"):

    if text.strip() == "":
        st.warning("Please enter some text")
    else:

        clean = clean_text(text)

        vec = vectorizer.transform([clean]).toarray()

        sentiment_score = get_sentiment(clean)

        vec = np.hstack((vec, [[sentiment_score]]))

        pred = model.predict(vec)[0]

        score = model.decision_function(vec)[0]
        confidence = round((abs(score) / (abs(score) + 1)) * 100, 2)

        # 🔥 RESULT SECTION
        st.subheader("🔍 Analysis Result")

        if pred == 1:
            st.error(f"⚠️ Cyberbullying Detected ({confidence}%)")
        else:
            st.success(f"✅ Normal Text ({confidence}%)")

        # ⭐ Sentiment display (highlighted separately)
        st.markdown("### 💬 Sentiment Analysis Score")
        st.info(f"Sentiment Score: {round(sentiment_score, 3)}")

        if sentiment_score < -0.3:
            st.write("🔴 Negative sentiment detected")
        elif sentiment_score > 0.3:
            st.write("🟢 Positive sentiment detected")
        else:
            st.write("🟡 Neutral sentiment detected")

# 🔹 Sidebar (clean, no accuracy/ROC)
st.sidebar.header("📊 Model Info")
st.sidebar.write(f"Dataset Size: {info['dataset_size']}")
st.sidebar.write("Model: Linear SVM + TF-IDF + Sentiment Feature")
