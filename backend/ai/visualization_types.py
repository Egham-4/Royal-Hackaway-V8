
from typing import List, Union, Literal, Optional
from pydantic import BaseModel, Field

#Line Graph visualizations.
class LineGraphVisualization(BaseModel):
    chart_type: Literal["line"] = Field("line", description="Specifies that this is a line graph visualization.")
    x_axis: str = Field(..., description="The exact name of the column to be used for the x-axis.")
    x_to_percentage: bool = Field(..., description="True if the x-axis values should be converted to percentages; False otherwise.")
    y_axis: str = Field(..., description="The exact name of the column to be used for the y-axis.")
    y_to_percentage: bool = Field(..., description="True if the y-axis values should be converted to percentages; False otherwise.")



#Pie Chart visualizations.
class PieChartVisualization(BaseModel):
    chart_type: Literal["pie"] = Field("pie", description="Specifies that this is a pie chart visualization.")
    # For a pie chart, we assume the important information is a list of category labels.
    categories: List[str] = Field(..., description="A list of exact category names to include in the pie chart.")



#Bar Chart visualizations.
class BarChartVisualization(BaseModel):
    chart_type: Literal["bar"] = Field("bar", description="Specifies that this is a bar chart visualization.")
    x_axis: str = Field(..., description="The exact name of the column to be used for the x-axis (typically categorical).")
    y_axis: str = Field(..., description="The exact name of the column to be used for the y-axis (typically numeric).")
    orientation: Literal["vertical", "horizontal"] = Field("vertical", description="Orientation of the bar chart.")
    stacked: bool = Field(False, description="True if the bar chart should be stacked; False otherwise.")


#Scatter Plot visualizations.
class ScatterPlotVisualization(BaseModel):
    chart_type: Literal["scatter"] = Field("scatter", description="Specifies that this is a scatter plot visualization.")
    x_axis: str = Field(..., description="The exact name of the column for the x-axis.")
    y_axis: str = Field(..., description="The exact name of the column for the y-axis.")
    # Optional grouping or color dimension.
    color: Optional[str] = Field(None, description="Optional column name for color grouping.")
    marker: str = Field("o", description="The marker style for the scatter plot.")


# Define a model for Area Chart visualizations.
class AreaChartVisualization(BaseModel):
    chart_type: Literal["area"] = Field("area", description="Specifies that this is an area chart visualization.")
    x_axis: str = Field(..., description="The exact name of the column to be used for the x-axis.")
    y_axis: str = Field(..., description="The exact name of the column to be used for the y-axis.")
    stacked: bool = Field(False, description="True if the area chart should be stacked; False otherwise.")

# Define the main model which contains the generated Python code and the visualization parameters.
class VisualizationTypes(BaseModel):
    visualization: Union[
        LineGraphVisualization,
        PieChartVisualization,
        BarChartVisualization,
        ScatterPlotVisualization,
        AreaChartVisualization
    ] = Field(..., description="Parameters that define how to visualize the data.")


