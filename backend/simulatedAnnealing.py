from cube import fitness, initialize_cube

import numpy as np
import random
import time

ARR = np.array([[[25, 16, 80, 104, 90],
        [115, 98, 4, 1, 97],
        [42, 111, 85, 2, 75],
        [66, 72, 27, 102, 48],
        [67, 18, 119, 106, 5],],

       [[91, 77, 71, 6, 70],
        [52, 64, 117, 69, 13],
        [30, 118, 21, 123, 23],
        [26, 39, 92, 44, 114],
        [116, 17, 14, 73, 95]],

       [[47, 61, 45, 76, 86],
        [107, 43, 38, 33, 94],
        [89, 68, 63, 58, 37],
        [32, 93, 88, 83, 19],
        [40, 50, 81, 65, 79]],

       [[31, 53, 112, 109, 10],
        [12, 82, 34, 87, 100],
        [103, 3, 105, 8, 96],
        [113, 57, 9, 62, 74],
        [56, 120, 55, 49, 35]],

       [[121, 108, 7, 20, 59],
        [29, 28, 122, 125, 11],
        [51, 15, 41, 124, 84],
        [78, 54, 99, 24, 60],
        [36, 110, 46, 22, 101]]])

def createNewSolution(newSolution):
    i1, j1, k1, i2, j2, k2 = random.choices(range(5), k=6)
    newSolution[i1][j1][k1], newSolution[i2][j2][k2] = newSolution[i2][j2][k2], newSolution[i1][j1][k1]
    return newSolution

def simulatedAnnealing(cube, initialTemperature, coolingRate, threshold):
    currentScore = fitness(cube)
    temperature = initialTemperature
    currentSolution = cube
    sumStuck = 0
    iteration = 0
    fitnesses = []
    acceptanceProbabilitiess = []
    states = []

    while temperature > 1:
        if currentScore == 0:
            break

        newSolution = np.copy(currentSolution)
        newSolution = createNewSolution(newSolution)
        newScore = fitness(newSolution)

        if newScore < currentScore:
            currentSolution = newSolution
            currentScore = newScore
        else:
            acceptanceProbability = np.exp((newScore - currentScore)*(-1) / temperature)
            temp = random.random()
            if threshold < acceptanceProbability:
                currentSolution = newSolution
                currentScore = newScore
            else:
                sumStuck += 1

        temperature *= coolingRate
        iteration += 1
        fitnesses.append(currentScore)
        acceptanceProbabilitiess.append(acceptanceProbability)
        states.append(currentSolution)
    
    return currentSolution, currentScore, sumStuck, iteration, fitnesses, acceptanceProbabilitiess, states

# n = 5 
# initialTemperature = 100000
# coolingRate = 0.9999
# threshold = 0.99
# startTime = time.time()

# bestSolution, bestScore, sumStuck, iteration, fitnesses, acceptanceProbabilitiess, states = simulatedAnnealing(n, initialTemperature, coolingRate, threshold)
# endTime = time.time()

# print("Best configuration (5x5x5 Magic Cube):")
# print(bestSolution)
# print(f"Best score: {bestScore}")
# print(f"Stuck in local optima: {sumStuck}")
# duration = endTime - startTime
# print(f"Duration: {duration} second")
