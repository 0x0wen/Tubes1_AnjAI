from flask import Flask, jsonify, request
from flask_cors import CORS

import numpy as np

import time

from SA_HillClimb import steepest_ascent_hill_climbing
from SM_HillClimb import sideways_move_hill_climbing
from S_HillClimb import stochastic_hill_climbing
from RR_HillClimb import random_restart_hill_climbing


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return 'Hello world!'

@app.route("/api/hill-climbing/steep", methods=['POST'])
def hillClimb():
    data = request.get_json()
    cube = np.array(data["cube"])
    time_start = time.time()
    finalstate = steepest_ascent_hill_climbing(cube)
    time_end = time.time()
    time_taken = time_end - time_start
    
    response = {
        "finalstate": finalstate.tolist(),
        "time_taken": time_taken
    }
    return jsonify(response)

@app.route("/api/hill-climbing/side", methods=['POST'])
def hillClimbSide():
    data = request.get_json()
    cube = np.array(data["cube"])
    maxSide = data["maxSide"]
    
    print(data)
    return "Climb yo mama's hill sideways!"

@app.route("/api/hill-climbing/stoc")
def hillClimbStoc():
    data = request.get_json()
    cube = np.array(data["cube"])
    print(data)
    return "Climb yo mama's hill stochastically!"

@app.route("/api/hill-climbing/rando", methods=['POST'])
def hillClimbRando():
    data = request.get_json()
    cube = np.array(data["cube"])
    restarts = data["restarts"]
    print(data)
    return "Climb yo mama's hill randomly!"

@app.route("/api/simulated-annealing", methods=['POST'])
def simulatedAnnealing():
    data = request.get_json()
    cube = np.array(data["cube"])
    thres = data["thres"]
    temp = data["temp"]
    cool = data ["cool"]
    print(data)
    return 'Simulate this anal!'

@app.route("/api/genetic-algorithm", methods=['POST'])
def geneticAlgorithm():
    data = request.get_json()
    cube = np.array(data["cube"])
    populasi = data["pop"]
    iterasi = data["iter"]
    print(data)
    return 'Genetic maybe up but syndrome goes down!'

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)