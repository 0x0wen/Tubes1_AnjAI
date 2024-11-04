import numpy as np
import random
from constants import MAGIC_CUBE_SIZE, MAGIC_CONSTANT

# Initialize a 5x5x5 cube with unique numbers 1 to 125 randomly placed
def initialize_cube():
    numbers = list(range(1, MAGIC_CUBE_SIZE**3 + 1))
    random.shuffle(numbers)
    return np.array(numbers).reshape((MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE))

# Calculate the fitness score of a cube
def fitness(cube):
    score = 0
    
    # Rows, columns, and pillars in each dimension
    for i in range(MAGIC_CUBE_SIZE):
        score += abs(np.sum(cube[i, :, :]) - MAGIC_CONSTANT*MAGIC_CUBE_SIZE)  # x-axis slices
        score += abs(np.sum(cube[:, i, :]) - MAGIC_CONSTANT*MAGIC_CUBE_SIZE)  # y-axis slices
        score += abs(np.sum(cube[:, :, i]) - MAGIC_CONSTANT*MAGIC_CUBE_SIZE)  # z-axis slices

    # Diagonals in each 2D layer
    for i in range(MAGIC_CUBE_SIZE):
        score += abs(np.sum(cube[i, :, :].diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(np.fliplr(cube[i, :, :]).diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(cube[:, i, :].diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(np.fliplr(cube[:, i, :]).diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(cube[:, :, i].diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(np.fliplr(cube[:, :, i]).diagonal()) - MAGIC_CONSTANT)

    # Main 3D cube diagonals
    score += abs(np.sum([cube[i, i, i] for i in range(MAGIC_CUBE_SIZE)]) - MAGIC_CONSTANT)
    score += abs(np.sum([cube[i, i, MAGIC_CUBE_SIZE - i - 1] for i in range(MAGIC_CUBE_SIZE)]) - MAGIC_CONSTANT)

    return score

# Initialize a population of cubes
def initialize_population(size):
    return [initialize_cube() for _ in range(size)]