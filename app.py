from flask import Flask, render_template, request
import google.generativeai as genai
import os

app = Flask(__name__)
os.makedirs("static", exist_ok=True)

# 🔑 Replace with your actual API key
genai.configure(api_key="AIzaSyDqUCdXOtJheJv3YyKiL6wQVOhgoeQEBgg")

# Prefer pro, fallback to flash
AVAILABLE_MODEL = "gemini-2.5-pro"
try:
    model = genai.GenerativeModel(AVAILABLE_MODEL)
except Exception:
    model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/", methods=["GET", "POST"])
def index():
    caption = ""
    image_path = ""

    if request.method == "POST":
        uploaded = request.files.get("image")
        if uploaded and uploaded.filename:
            image_path = os.path.join("static", uploaded.filename)
            uploaded.save(image_path)

            try:
                with open(image_path, "rb") as img:
                    image_bytes = img.read()

                image_input = {"mime_type": "image/jpeg", "data": image_bytes}

                response = model.generate_content([
                    "Write a short descriptive caption for this image.",
                    image_input
                ])

                caption = getattr(response, "text", "⚠️ No caption returned.")
            except Exception as e:
                caption = f"❌ Error generating caption: {e}"
                print(e)

    return render_template("index.html", caption=caption, image_path=image_path)

if __name__ == "__main__":
    app.run(debug=True)
