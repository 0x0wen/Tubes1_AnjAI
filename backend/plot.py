# save_plot.py
import mpld3
import matplotlib.pyplot as plt
from mpld3 import plugins

def save_plot():
    # Example data
    iterations = list(range(1, 51))
    objective_values = [i**0.5 * 10 for i in iterations]  # Sample objective function values

    # Create the plot with enhanced styling
    fig, ax = plt.subplots(figsize=(10, 6))
    line, = ax.plot(iterations, objective_values, label="Objective Function", color='dodgerblue', linestyle='-', linewidth=2, marker='o', markersize=5)
    ax.set_xlabel("Iterations", fontsize=14, color="darkblue", fontweight="bold")
    ax.set_ylabel("Objective Function Value", fontsize=14, color="darkblue", fontweight="bold")
    ax.set_title("Objective Function vs. Iterations", fontsize=18, fontweight='bold', color="navy")
    ax.grid(True, which='both', linestyle='--', linewidth=0.5, color='gray')
    ax.legend(loc='upper left', fontsize=12, facecolor='lightgrey', edgecolor='darkgrey')

    # Enable interactive tooltips to display coordinates on hover
    tooltip = plugins.PointLabelTooltip(line, labels=[f"({x}, {y:.2f})" for x, y in zip(iterations, objective_values)])
    plugins.connect(fig, tooltip)

    # Generate the HTML from mpld3
    html_fragment    = mpld3.fig_to_html(fig)
    
    html_str = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Objective Function vs. Iterations</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }}
            .plot-container {{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f0f0f0;
            }}
        </style>
    </head>
    <body>
        <div class="plot-container">
            {html_fragment}
        </div>
    </body>
    </html>
    """
    
    with open("../frontend/public/plot/plotObjFunc.html", "w") as f:
        f.write(html_str)

if __name__ == "__main__":
    save_plot()
