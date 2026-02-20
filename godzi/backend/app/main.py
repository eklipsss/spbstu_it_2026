from fastapi import FastAPI

app = FastAPI(title="Backend API", version="0.1.0")

@app.get("/homepage")
def home():
    return {"status": "ok"}
