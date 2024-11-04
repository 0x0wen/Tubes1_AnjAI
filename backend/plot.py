# save_plot.py
import mpld3
import matplotlib
import matplotlib.pyplot as plt
from mpld3 import plugins

matplotlib.use('Agg')

def save_plot(X, Y, filename):
    
    print("X:", X)
    
    X_FF = list(range(1, X))
    
    print("Length of X_FF:", len(X_FF))
    print("Length of Y:", len(Y))
    
    title = "Objective Function vs. Iterations" if filename == "plotObjFunc" else "Objective Function vs. Probability"
    yLabel = "Objective Function Value" if filename == "plotObjFunc" else "Probability"

    fig, ax = plt.subplots(figsize=(10, 6))
    line, = ax.plot(X_FF, Y, label="Objective Function", color='dodgerblue', linestyle='-', linewidth=2, marker='o', markersize=5)
    ax.set_xlabel("Iterations", fontsize=14, color="darkblue", fontweight="bold")
    ax.set_ylabel(yLabel, fontsize=14, color="darkblue", fontweight="bold")
    ax.set_title(title, fontsize=18, fontweight='bold', color="navy")
    ax.grid(True, which='both', linestyle='--', linewidth=0.5, color='gray')
    ax.legend(loc='upper left', fontsize=12, facecolor='lightgrey', edgecolor='darkgrey')

    tooltip = plugins.PointLabelTooltip(line, labels=[f"({x}, {y:.2f})" for x, y in zip(X_FF, Y)])
    plugins.connect(fig, tooltip)

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
    
    with open("../frontend/public/plot/"+ filename +".html", "w") as f:
        f.write(html_str)
