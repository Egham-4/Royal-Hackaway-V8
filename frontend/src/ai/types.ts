import { z } from "zod";

export const ImportantHeaders = z.object({
    headers: z.array(z.string()).describe("List of important headers")
  });
  
export const MetadataField = z.object({
    dtype: z.string(),
    uniqueValues: z.number()
  });
  
  // Line Graph Visualization
  const LineGraphVisualization = z.object({
    chart_type: z.literal("line").describe("Specifies that this is a line graph visualization"),
    x_axis: z.string().describe("The exact name of the column to be used for the x-axis"),
    y_axis: z.string().describe("The exact name of the column to be used for the y-axis"),
    x_to_percentage: z.boolean().optional().describe("True if the x-axis values should be converted to percentages"),
    y_to_percentage: z.boolean().optional().describe("True if the y-axis values should be converted to percentages")
  });
  
  // Pie Chart Visualization
  const PieChartVisualization = z.object({
    chart_type: z.literal("pie").describe("Specifies that this is a pie chart visualization"),
    categories: z.array(z.string()).describe("A list of exact category names to include in the pie chart")
  });
  
  // Bar Chart Visualization
  const BarChartVisualization = z.object({
    chart_type: z.literal("bar").describe("Specifies that this is a bar chart visualization"),
    x_axis: z.string().describe("The exact name of the column to be used for the x-axis (typically categorical)"),
    y_axis: z.string().describe("The exact name of the column to be used for the y-axis (typically numeric)"),
    orientation: z.enum(["vertical", "horizontal"]).optional().default("vertical").describe("Orientation of the bar chart"),
    stacked: z.boolean().optional().default(false).describe("True if the bar chart should be stacked")
  });
  
  // Area Chart Visualization
  const AreaChartVisualization = z.object({
    chart_type: z.literal("area").describe("Specifies that this is an area chart visualization"),
    x_axis: z.string().describe("The exact name of the column to be used for the x-axis"),
    y_axis: z.string().describe("The exact name of the column to be used for the y-axis"),
    stacked: z.boolean().optional().default(false).describe("True if the area chart should be stacked")
  });
  
  // Main Visualization Types
  const VisualizationTypes = z.object({
    visualization: z.array(
      z.discriminatedUnion("chart_type", [
        LineGraphVisualization,
        PieChartVisualization,
        BarChartVisualization,
        AreaChartVisualization
      ])
    ).describe("Parameters that define how to visualize the data")
  });
  
  // Type exports
  export type TLineGraphVisualization = z.infer<typeof LineGraphVisualization>;
  export type TPieChartVisualization = z.infer<typeof PieChartVisualization>;
  export type TBarChartVisualization = z.infer<typeof BarChartVisualization>;
  export type TAreaChartVisualization = z.infer<typeof AreaChartVisualization>;
  export type TVisualizationTypes = z.infer<typeof VisualizationTypes>;
  
  // Schema exports
  export {
    LineGraphVisualization,
    PieChartVisualization,
    BarChartVisualization,
    AreaChartVisualization,
    VisualizationTypes
  };