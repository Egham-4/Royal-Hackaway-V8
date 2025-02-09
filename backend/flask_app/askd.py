from ai.visualization_types import PieChartVisualization, LineGraphVisualization, BarChartVisualization, AreaChartVisualization
import pandas as pd
visualisation = analysis['data_visualization']

datavis = []
for v in visualisation:
    if type(v) == LineGraphVisualization or BarChartVisualization or AreaChartVisualization:
        revenue_dict = {
            "Revenue Growth": {str(year): f"${revenue}M" for year, revenue in zip(df[v['x_axis']], df[v["y_axis"]])}
        }
        datavis.append(revenue_dict)
    if type(v) == PieChartVisualization:

       piedict = {}
       for i in v['categories']:
           piedict[i] = df[i]

