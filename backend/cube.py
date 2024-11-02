import numpy as np
import random

# Constants
N = 5
MAGIC_CONSTANT = 315  # Target sum for rows, columns, and diagonals
POPULATION_SIZE = 100
MUTATION_RATE = 0.05
GENERATIONS = 1000

# Initialize a 5x5x5 cube with unique numbers 1 to 125 randomly placed
def initialize_cube():
    numbers = list(range(1, N**3 + 1))
    random.shuffle(numbers)
    return np.array(numbers).reshape((N, N, N))

# Calculate the fitness score of a cube
def fitness(cube):
    score = 0
    
    # Rows, columns, and pillars in each dimension
    for i in range(N):
        score += abs(np.sum(cube[i, :, :]) - MAGIC_CONSTANT*N)  # x-axis slices
        score += abs(np.sum(cube[:, i, :]) - MAGIC_CONSTANT*N)  # y-axis slices
        score += abs(np.sum(cube[:, :, i]) - MAGIC_CONSTANT*N)  # z-axis slices

    # Diagonals in each 2D layer
    for i in range(N):
        score += abs(np.sum(cube[i, :, :].diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(np.fliplr(cube[i, :, :]).diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(cube[:, i, :].diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(np.fliplr(cube[:, i, :]).diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(cube[:, :, i].diagonal()) - MAGIC_CONSTANT)
        score += abs(np.sum(np.fliplr(cube[:, :, i]).diagonal()) - MAGIC_CONSTANT)

    # Main 3D cube diagonals
    score += abs(np.sum([cube[i, i, i] for i in range(N)]) - MAGIC_CONSTANT)
    score += abs(np.sum([cube[i, i, N - i - 1] for i in range(N)]) - MAGIC_CONSTANT)

    return score

# Initialize a population of cubes
def initialize_population(size):
    return [initialize_cube() for _ in range(size)]

# Selection: Select two parents using tournament selection
def select_parents(population):
    tournament_size = 5
    tournament = random.sample(population, tournament_size)
    parents = sorted(tournament, key=fitness)[:2]
    return parents

# Crossover: Create a child by combining parts of the parents while ensuring uniqueness
def crossover(parent1, parent2):
    # Convert to a flat array to facilitate crossover and keep track of used numbers
    parent1_flat = parent1.flatten()
    parent2_flat = parent2.flatten()
    child_flat = np.empty_like(parent1_flat)
    
    used_numbers = set()
    for i in range(len(parent1_flat)):
        if random.random() > 0.5 and parent1_flat[i] not in used_numbers:
            child_flat[i] = parent1_flat[i]
            used_numbers.add(parent1_flat[i])
        elif parent2_flat[i] not in used_numbers:
            child_flat[i] = parent2_flat[i]
            used_numbers.add(parent2_flat[i])
        else:
            remaining = list(set(range(1, N**3 + 1)) - used_numbers)
            child_flat[i] = random.choice(remaining)
            used_numbers.add(child_flat[i])

    return child_flat.reshape(N, N, N)

# Mutation: Swap two unique positions in the cube
def mutate(cube):
    if random.random() < MUTATION_RATE:
        x1, y1, z1 = random.randint(0, N - 1), random.randint(0, N - 1), random.randint(0, N - 1)
        x2, y2, z2 = random.randint(0, N - 1), random.randint(0, N - 1), random.randint(0, N - 1)
        while (x1, y1, z1) == (x2, y2, z2):  # Ensure different positions
            x2, y2, z2 = random.randint(0, N - 1), random.randint(0, N - 1), random.randint(0, N - 1)
        cube[x1, y1, z1], cube[x2, y2, z2] = cube[x2, y2, z2], cube[x1, y1, z1]
    return cube

# Evolve the population
def evolve(population):
    new_population = []
    for _ in range(len(population)):
        parent1, parent2 = select_parents(population)
        child = crossover(parent1, parent2)
        child = mutate(child)
        new_population.append(child)
    return new_population

# Main Genetic Algorithm
def genetic_algorithm():
    population = initialize_population(POPULATION_SIZE)
    best_cube = min(population, key=fitness)
    best_score = fitness(best_cube)

    for generation in range(GENERATIONS):
        population = evolve(population)
        current_best = min(population, key=fitness)
        current_best_score = fitness(current_best)

        if current_best_score < best_score:
            best_score = current_best_score
            best_cube = current_best

        print(f"Generation {generation} | Best Score: {best_score}")

        if best_score == 0:
            break

    return best_cube, best_score

# Run the Genetic Algorithm
# best_cube, best_score = genetic_algorithm()
# print("Best Cube Solution:")
# print(best_cube)
# print("Best Score:", best_score)
