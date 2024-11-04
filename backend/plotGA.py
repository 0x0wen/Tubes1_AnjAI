# save_plot.py
import mpld3
import matplotlib
import matplotlib.pyplot as plt
from mpld3 import plugins

matplotlib.use('Agg')

def save_plotGA(X, best_scores, avg_score, filename):
    print("X:", X)
    
    # Adjust X_FF based on length of best_scores or avg_score
    X_FF = list(range(1, X))
    
    print("Length of X_FF:", len(X_FF))
    print("Length of best_scores:", len(best_scores))
    print("Length of avg_score:", len(avg_score))
    
    # Define title and labels based on the filename
    title = "Objective Function vs. Iterations" if filename == "plotObjFunc" else "Objective Function vs. Probability"
    yLabel = "Objective Function Value" if filename == "plotObjFunc" else "Probability"

    # Create the plot
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Plot best_scores and avg_score
    line1, = ax.plot(X_FF, best_scores, label="best_scores", color='dodgerblue', linestyle='-', linewidth=2, marker='o', markersize=5)
    line2, = ax.plot(X_FF, avg_score, label="avg_score", color='darkorange', linestyle='-', linewidth=2, marker='x', markersize=5)
    
    # Set labels and title
    ax.set_xlabel("Iterations", fontsize=14, color="darkblue", fontweight="bold")
    ax.set_ylabel(yLabel, fontsize=14, color="darkblue", fontweight="bold")
    ax.set_title(title, fontsize=18, fontweight='bold', color="navy")
    ax.grid(True, which='both', linestyle='--', linewidth=0.5, color='gray')
    ax.legend(loc='upper left', fontsize=12, facecolor='lightgrey', edgecolor='darkgrey')

    # Add tooltips for both lines
    tooltip1 = plugins.PointLabelTooltip(line1, labels=[f"({x}, {y:.2f})" for x, y in zip(X_FF, best_scores)])
    tooltip2 = plugins.PointLabelTooltip(line2, labels=[f"({x}, {y:.2f})" for x, y in zip(X_FF, avg_score)])
    plugins.connect(fig, tooltip1, tooltip2)

    # Generate HTML content
    html_fragment = mpld3.fig_to_html(fig)
    html_str = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{title}</title>
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
    
    # Save the HTML file
    with open("../frontend/public/plot/"+ filename +".html", "w") as f:
        f.write(html_str)
