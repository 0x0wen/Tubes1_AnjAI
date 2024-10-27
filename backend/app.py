from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return 'Hello world!'

@app.route("/api/hill-climbing")
def hillClimb():
    return "Climb yo mama's hill!"

@app.route("/api/simulated-annealing")
def simulatedAnnealing():
    return 'Simulate this anal!'

@app.route("/api/genetic-algorithm")
def geneticAlgorithm():
    return 'Genetic maybe up but syndrome goes down!'

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)