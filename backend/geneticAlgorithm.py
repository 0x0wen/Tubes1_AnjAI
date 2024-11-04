from cube import fitness, initialize_cube
from constants import MAGIC_CUBE_SIZE, MAGIC_NUMBERS, POPULATION_SIZES, ITERATION_VARIANTS, EXPERIMENT_RUNS
import numpy as np
import random
import time
import matplotlib.pyplot as plt



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

def create_random_cube():
    cube = np.array(MAGIC_NUMBERS)
    np.random.shuffle(cube)
    return cube.reshape((MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE))

def crossover(parent1, parent2):
    size = MAGIC_CUBE_SIZE ** 3
    crossover_point = random.randint(1, size - 2)
    child1 = np.empty(size, dtype=int)
    child2 = np.empty(size, dtype=int)

    # Perform crossover with unique preservation
    child1[:crossover_point], child2[:crossover_point] = parent1.flat[:crossover_point], parent2.flat[:crossover_point]
    
    # Filter out numbers already in each child to maintain uniqueness
    remaining1 = [x for x in MAGIC_NUMBERS if x not in child1[:crossover_point]]
    remaining2 = [x for x in MAGIC_NUMBERS if x not in child2[:crossover_point]]
    
    # Ensure remaining parts match the exact number of required elements
    child1[crossover_point:] = remaining1[:size - crossover_point]
    child2[crossover_point:] = remaining2[:size - crossover_point]

    return child1.reshape((MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE)), \
           child2.reshape((MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE))

def mutate(cube):
    idx1, idx2 = np.random.choice(range(MAGIC_CUBE_SIZE ** 3), 2, replace=False)
    flat_cube = cube.flatten()
    flat_cube[idx1], flat_cube[idx2] = flat_cube[idx2], flat_cube[idx1]
    return flat_cube.reshape((MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE, MAGIC_CUBE_SIZE))

def geneticAlgorithm(population_size, max_iterations):
    population = [create_random_cube() for _ in range(population_size)]
    best_scores = []
    avg_scores = []
    best_cube = None

    for iteration in range(max_iterations):
        print("iteration", iteration, "first population", population[0], "with fitness", fitness(population[0]))
        # Evaluate fitness of population
        fitness_values = [1 / (1 + fitness(cube)) for cube in population]
        total_fitness = sum(fitness_values)
        best_scores.append(1 / max(fitness_values) - 1)  # Convert fitness back to objective value
        avg_scores.append((sum(1 / f - 1 for f in fitness_values) / population_size))  # Average objective score

        # Track the best cube in the current population
        min_index = np.argmin([fitness(cube) for cube in population])
        best_cube = population[min_index]

        # Selection based on fitness
        parents = random.choices(population, weights=fitness_values, k=population_size)

        # Create next generation with crossover and mutation
        next_population = []
        for i in range(0, population_size, 2):
            if i + 1 < population_size:
                child1, child2 = crossover(parents[i], parents[i + 1])
                next_population.append(mutate(child1))
                next_population.append(mutate(child2))
            else:
                next_population.append(mutate(parents[i]))

        population = next_population

    # Best objective function result from final population
    final_best_score = min(fitness(cube) for cube in population)
    return final_best_score, best_scores, avg_scores, best_cube 

def runGeneticAlgorithm():
    results = []
    for population_size in POPULATION_SIZES:
        for iterations in ITERATION_VARIANTS:
            for run in range(EXPERIMENT_RUNS):
                start_time = time.time()
                best_score, best_scores, avg_scores,best_cube = geneticAlgorithm(population_size, iterations)
                duration = time.time() - start_time

                # Record the results for each experiment
                results.append({
                    'population_size': population_size,
                    'iterations': iterations,
                    'run': run + 1,
                    'final_best_score': best_score,
                    'duration': duration,
                    'cube': best_cube
                })

                # Plotting the progress of each experiment
                plt.plot(best_scores, label=f'Best (Pop={population_size}, Iter={iterations})')
                plt.plot(avg_scores, label=f'Avg (Pop={population_size}, Iter={iterations})')
                plt.xlabel('Iterations')
                plt.ylabel('Objective Function Value')
                plt.legend()
                plt.show()

    # Print experiment results
    for result in results:
        print(f"Population: {result['population_size']}, Iterations: {result['iterations']}, Run: {result['run']}, "
              f"Final Best Score: {result['final_best_score']}, Cube: {result['cube']}, Duration: {result['duration']:.2f}s")
