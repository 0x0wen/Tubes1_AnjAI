import numpy as np
from itertools import product
from cube import fitness
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
def steepest_ascent_hill_climbing(cube):
    current_state = cube
    current_heuristic = fitness(current_state)
    iterations = 1  # Track the number of iterations
    fitnesses = []
    
    start = time.time()
    while True:
        neighbors = generate_neighbors(current_state)
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
            break
        
        # Move to the best neighbor
        current_state = best_neighbor
        current_heuristic = best_heuristic
        print(iterations, current_heuristic)
        fitnesses.append(current_heuristic)
        iterations += 1
    
    endtime = time.time()
    time_taken = endtime - start 
    return current_state, current_heuristic, fitnesses, time_taken, iterations

# initial_cube = initialize_cube()
# # print(initial_cube)
# print("Initial Heuristic Score (Scrambled):", fitness(initial_cube))
# time_start = time.time()
# solved_cube = steepest_ascent_hill_climbing(initial_cube)
# time_end = time.time()
# print("Time taken:", time_end - time_start)
# print("Final Heuristic Score:", fitness(solved_cube))
# # print("Solved Cube:", solved_cube)

