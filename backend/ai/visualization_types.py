from pydantic import BaseModel, Field
from typing import List, Literal, Optional, Union

# Line Graph visualization
class LineGraphVisualization(BaseModel):
    chart_type: Literal["line"] = Field("line", description="Specifies that this is a line graph visualization.")
    x_axis: str = Field(..., description="The exact name of the column to be used for the x-axis.")
    y_axis: str = Field(..., description="The exact name of the column to be used for the y-axis.")
    x_to_percentage: Optional[bool] = Field(None, description="True if the x-axis values should be converted to percentages.")
    y_to_percentage: Optional[bool] = Field(None, description="True if the y-axis values should be converted to percentages.")


# Pie Chart visualization
class PieChartVisualization(BaseModel):
    chart_type: Literal["pie"] = Field("pie", description="Specifies that this is a pie chart visualization.")
    categories: List[str] = Field(..., description="A list of exact category names to include in the pie chart.")


# Bar Chart visualization
class BarChartVisualization(BaseModel):
    chart_type: Literal["bar"] = Field("bar", description="Specifies that this is a bar chart visualization.")
    x_axis: str = Field(..., description="The exact name of the column to be used for the x-axis (typically categorical).")
    y_axis: str = Field(..., description="The exact name of the column to be used for the y-axis (typically numeric).")
    orientation: Optional[Literal["vertical", "horizontal"]] = Field("vertical", description="Orientation of the bar chart.")
    stacked: Optional[bool] = Field(False, description="True if the bar chart should be stacked.")


# Area Chart visualization
class AreaChartVisualization(BaseModel):
    chart_type: Literal["area"] = Field("area", description="Specifies that this is an area chart visualization.")
    x_axis: str = Field(..., description="The exact name of the column to be used for the x-axis.")
    y_axis: str = Field(..., description="The exact name of the column to be used for the y-axis.")
    stacked: Optional[bool] = Field(False, description="True if the area chart should be stacked.")
# Define the main model which contains the generated Python code and the visualization parameters.
class VisualizationTypes(BaseModel):
    visualization: List[Union[
        LineGraphVisualization,
        PieChartVisualization,
        BarChartVisualization,
        AreaChartVisualization
    ]] = Field(..., description="3 Parameters that define how to visualize the data.")


