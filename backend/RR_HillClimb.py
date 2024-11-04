import numpy as np
from itertools import product
from cube import initialize_cube, fitness
import time

#menghasilkan semua kemungkinan state tetangga dengan menukar 2 angka
def generate_neighbors(cube):
    neighbors = []
    
    N = len(cube)
    
    indices = np.array(list(product(range(N), repeat=3)))
    
    for idx in range(len(indices)):
        i, j, k = indices[idx]
        for di, dj, dk in product([-1, 0, 1], repeat=3):
            if di == dj == dk == 0:
                continue
            ni, nj, nk = i + di, j + dj, k + dk
            if 0 <= ni < N and 0 <= nj < N and 0 <= nk < N:
                new_cube = cube.copy()
                new_cube[i, j, k], new_cube[ni, nj, nk] = new_cube[ni, nj, nk], new_cube[i, j, k]
                neighbors.append(new_cube)
    
    return neighbors

# Hill Climbing Algorithm
def random_restart_hill_climbing(restart_limit, cube):
    optimal_states = []
    iterations = []  # iterasi per restart
    wholeIterations = 1  # iterasi total dari algoritma
    fitnesses = [] # fitness total dari algoritma
    start = time.time()
    
    for _ in range(restart_limit):
        current_heuristic = fitness(cube)
        iteration = 1  # Track the number of iterations
        
        while True:
            #mulai time
            neighbors = generate_neighbors(cube)
            best_neighbor = None
            best_heuristic = current_heuristic
            
            # Find the neighbor with the highest heuristic score
            for neighbor in neighbors:
                neighbor_heuristic = fitness(neighbor)
                if neighbor_heuristic < best_heuristic:
                    best_heuristic = neighbor_heuristic
                    best_neighbor = neighbor
            
            # If no better neighbor is found, terminate
            if best_neighbor is None:
                optimal_states.append(cube)
                iterations.append(iteration)
                break
            
            # Move to the best neighbor
            cube = best_neighbor
            current_heuristic = best_heuristic
            print(iteration, current_heuristic)
            fitnesses.append(current_heuristic)
            iteration += 1
            wholeIterations += 1
            
    #mencari state dengan heuristic terendah untuk di return
    best_state = min(optimal_states, key=fitness)
    end = time.time()
    time_taken = end - start
    #return state akhir, objective function yang dicapai, trus fitness sama wholeiterations buat bikin plot, durasi, banyak restart, sama iterasi per restart
    return best_state, current_heuristic, fitnesses, wholeIterations, time_taken, restart_limit, iterations


# time_start = time.time()
# solved_cube = random_restart_hill_climbing(3)
# time_end = time.time()
# print("Time taken:", time_end - time_start)
# print("Final Heuristic Score:", fitness(solved_cube))
# print("Solved Cube:", solved_cube)
