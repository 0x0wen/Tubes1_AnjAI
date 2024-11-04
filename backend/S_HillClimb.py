import numpy as np
from itertools import product
import random   
from cube import initialize_cube, fitness
import time

#menghasilkan semua kemungkinan state tetangga dengan menukar 2 angka
def generate_neighbors(cube):
    neighbors = []
    N = len(cube)  # Assuming cube is a 3D numpy array with shape (N, N, N)
    
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
def stochastic_hill_climbing(cube):
    current_state = cube
    current_heuristic = fitness(current_state)
    iterations = 0  # Inisialisasi variabel iterations
    max_attempts = 100  # Batas maksimal pemilihan acak tanpa perbaikan
    attempts = 0  # Counter untuk melacak jumlah pemilihan acak tanpa perbaikan
    fitnesses = []
    
    while True:
        start = time.time()
        neighbors = generate_neighbors(current_state)
        
        # Ambil satu tetangga secara acak
        random_neighbor = random.choice(neighbors)
        random_neighbor_heuristic = fitness(random_neighbor)
        
        # Jika fitness tetangga lebih besar atau sama dengan fitness saat ini, ulangi pengambilan tetangga acak
        if random_neighbor_heuristic >= current_heuristic:
            attempts += 1
            if attempts >= max_attempts:
                break
            continue
        
        # Move to the random neighbor
        current_state = random_neighbor
        current_heuristic = random_neighbor_heuristic
        print(iterations, current_heuristic)
        fitnesses.append(current_heuristic)
        iterations += 1
        attempts = 0  # Reset counter jika ada perbaikan
    
    end = time.time()
    time_taken = end - start
    return current_state, current_heuristic, fitnesses, time_taken, iterations

# initial_cube = initialize_cube()
# # print(initial_cube)
# print("Initial Heuristic Score (Scrambled):", fitness(initial_cube))
# time_start = time.time()
# solved_cube = stochastic_hill_climbing(initial_cube)
# time_end = time.time()
# print("Time taken:", time_end - time_start)
# print("Final Heuristic Score:", fitness(solved_cube))
# # print("Solved Cube:", solved_cube)

