import numpy as np
from itertools import product
from concurrent.futures import ThreadPoolExecutor
from cube import initialize_cube, fitness
import time

#menghasilkan semua kemungkinan state tetangga dengan menukar 2 angka
def generate_neighbors(cube):
    neighbors = []
    N = len(cube)  # Assuming cube is a 3D numpy array with shape (N, N, N)
    
    indices = np.array(list(product(range(N), repeat=3)))
    
    def swap_elements(idx):
        i, j, k = indices[idx]
        local_neighbors = []
        for di, dj, dk in product([-1, 0, 1], repeat=3):
            if di == dj == dk == 0:
                continue
            ni, nj, nk = i + di, j + dj, k + dk
            if 0 <= ni < N and 0 <= nj < N and 0 <= nk < N:
                new_cube = cube.copy()
                new_cube[i, j, k], new_cube[ni, nj, nk] = new_cube[ni, nj, nk], new_cube[i, j, k]
                local_neighbors.append(new_cube)
        return local_neighbors
    
    with ThreadPoolExecutor() as executor:
        results = executor.map(swap_elements, range(len(indices)))
    
    for result in results:
        neighbors.extend(result)
    
    return neighbors

# Hill Climbing Algorithm
def sideways_move_hill_climbing(cube, max_side_moves):
    current_state = cube
    current_heuristic = fitness(current_state)
    iterations = 1  # Inisialisasi variabel iterations
    no_improvement_count = 0  # Counter untuk melacak iterasi tanpa perbaikan
    max_no_improvement = max_side_moves  # Batas iterasi tanpa perbaikan
    fitnesses = []
    
    start = time.time()
    while True:
        neighbors = generate_neighbors(current_state)
        best_neighbor = None
        best_heuristic = current_heuristic
        
        # Find the neighbor with the highest heuristic score
        for neighbor in neighbors:
            neighbor_heuristic = fitness(neighbor)
            if neighbor_heuristic <= best_heuristic:
                best_heuristic = neighbor_heuristic
                best_neighbor = neighbor
        
        # If no better neighbor is found, increment no_improvement_count
        if best_neighbor is None or best_heuristic == current_heuristic:
            no_improvement_count += 1
        else:
            no_improvement_count = 0
        
        # If no improvement for max_no_improvement iterations, terminate
        if no_improvement_count >= max_no_improvement:
            break
        
        # Move to the best neighbor
        if best_neighbor is not None:
            current_state = best_neighbor
            current_heuristic = best_heuristic
        
        print(iterations, current_heuristic)
        fitnesses.append(current_heuristic)
        iterations += 1
    
    end = time.time()
    time_taken = end - start
    return current_state, current_heuristic, fitnesses, time_taken, iterations

# initial_cube = initialize_cube()
# # print(initial_cube)
# print("Initial Heuristic Score (Scrambled):", fitness(initial_cube))
# # time_start = time.time()
# solved_cube = sideways_move_hill_climbing(initial_cube, 3)
# # time_end = time.time()
# # print("Time taken:", time_end - time_start)
# print("Final Heuristic Score:", fitness(solved_cube))
# print("Solved Cube:", solved_cube)
