from flask import Flask, jsonify, request
from flask_cors import CORS

import numpy as np

import time

from SA_HillClimb import steepest_ascent_hill_climbing
from SM_HillClimb import sideways_move_hill_climbing
from S_HillClimb import stochastic_hill_climbing
from RR_HillClimb import random_restart_hill_climbing

from simulatedAnnealing import simulatedAnnealing

from geneticAlgorithm import geneticAlgorithm

from plot import save_plot

from plotGA import save_plotGA


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return 'Hello world!'

@app.route("/api/hill-climbing/steep", methods=['POST'])
def hillClimb():
    data = request.get_json()
    cube = np.array(data.get("cube", []))
    Fstate, current_heuristic, fitnesses, time_taken, iterations = steepest_ascent_hill_climbing(cube)
    
    finalState = Fstate.tolist()
    
    save_plot(iterations, fitnesses,"plotObjFunc")
    
    response = {
        "finalstate": finalState,
        "time_taken": time_taken,
        "hurestic": current_heuristic,
        "iterations": iterations,
        "algorithm" : "steep"
    }
    
    return jsonify(response)

@app.route("/api/hill-climbing/side", methods=['POST'])
def hillClimbSide():
    data = request.get_json()
    cube = np.array(data.get("cube", []))
    maxSide = data["maxSide"]
    
    current_state, current_heuristic, fitnesses, time_taken, iterations = sideways_move_hill_climbing(cube, maxSide)
    
    finalState = current_state.tolist()
    
    save_plot(iterations, fitnesses,"plotObjFunc")
    
    response = {
        "finalstate": finalState,
        "time_taken": time_taken,
        "hurestic": current_heuristic,
        "iterations": iterations,
        "algorithm" : "side"
    }
    
    return jsonify(response)

@app.route("/api/hill-climbing/stoc", methods=['POST'])
def hillClimbStoc():
    data = request.get_json()
    cube = np.array(data.get("cube", []))
    
    current_state, current_heuristic, fitnesses, time_taken, iterations = stochastic_hill_climbing(cube)
    
    finalState = current_state.tolist()
    
    response = {
        "finalstate": finalState,
        "time_taken": time_taken,
        "hurestic": current_heuristic,
        "iterations": iterations,
        "algorithm" : "stoc"
    }
    
    print(response)
    save_plot(iterations, fitnesses,"plotObjFunc")
    
    
    return jsonify(response)

@app.route("/api/hill-climbing/rando", methods=['POST'])
def hillClimbRando():
    data = request.get_json()
    cube = np.array(data.get("cube", []))
    restarts = data["restarts"]
    
    best_state, current_heuristic, fitnesses, wholeIterations, time_taken, restart_limit, iterations = random_restart_hill_climbing(restarts, cube)
    
    finalState = best_state.tolist()
    
    save_plot(wholeIterations, fitnesses,"plotObjFunc")
    
    response = {
        "finalstate": finalState,
        "time_taken": time_taken,
        "hurestic": current_heuristic,
        "restarts" : restart_limit,
        "iterRestarts" : iterations,
        "algorithm" : "rando",
    }
    
    return jsonify(response)

@app.route("/api/simulated-annealing", methods=['POST'])
def simulatedAnneal():
    data = request.get_json()
    cube = np.array(data.get("cube", []))
    thres = data["thres"]
    temp = data["temp"]
    cool = data ["cool"]
    
    timeStart = time.time()
    
    currentSolution, currentScore, sumStuck, iteration, fitnesses, acceptanceProbabilities, states = simulatedAnnealing(cube, temp, cool, thres)
    
    timeEnd = time.time()
    
    time_taken = timeEnd - timeStart
    
    finalState = currentSolution.tolist()
    
    save_plot(iteration +1, fitnesses,"plotObjFunc")
    
    save_plot(iteration +1, acceptanceProbabilities,"plotAcceptanceProb")
    
    response = {
        "finalstate": finalState,
        "time_taken": time_taken,
        "hurestic": currentScore,
        "iterations": iteration,
        "algorithm" : "simul",
        "frekuensi": sumStuck,
    }
    
    return jsonify(response)
    

@app.route("/api/genetic-algorithm", methods=['POST'])
def geneticAlgorit():
    data = request.get_json()
    cube = np.array(data.get("cube", []))
    populasi = data["pop"]
    iterasi = data["iter"]
    
    
    timeStart = time.time()
    final_best_score, best_scores, avg_scores, best_cube  = geneticAlgorithm(populasi, iterasi)
    timeEnd = time.time()
    
    time_taken = timeEnd - timeStart
    
    
    finalState = best_cube.tolist()
    
    save_plotGA(iterasi + 1, best_scores, avg_scores,"plotObjFunc")
    
    response = {
        "finalstate": finalState,
        "hurestic": final_best_score,
        "algorithm" : "genetic",
        "time_taken": time_taken,
    }
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)