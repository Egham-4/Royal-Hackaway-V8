import { z } from "zod";

export const ImportantHeaders = z.object({
  headers: z.array(z.string()).describe("List of important headers"),
});

export const MetadataField = z.object({
  dtype: z.string(),
  uniqueValues: z.number(),
});

// Line Graph Visualization
const LineGraphVisualization = z.object({
  chart_type: z
    .literal("line")
    .describe("Specifies that this is a line graph visualization"),
  x_axis: z
    .string()
    .describe("The exact name of the column to be used for the x-axis"),
  y_axis: z
    .string()
    .describe("The exact name of the column to be used for the y-axis"),
  x_to_percentage: z
    .boolean()
    .default(false)
    .describe("True if the x-axis values should be converted to percentages"),
  y_to_percentage: z
    .boolean()
    .default(false)
    .describe("True if the y-axis values should be converted to percentages"),
  insights: z
    .array(z.string())
    .describe("Key insights derived from the visualization"),
});

// Pie Chart Visualization
const PieChartVisualization = z.object({
  chart_type: z
    .literal("pie")
    .describe("Specifies that this is a pie chart visualization"),
  categories: z
    .array(z.string())
    .describe("A list of exact category names to include in the pie chart"),
  insights: z
    .array(z.string())
    .describe("Key insights derived from the visualization"),
});

// Bar Chart Visualization
const BarChartVisualization = z.object({
  chart_type: z
    .literal("bar")
    .describe("Specifies that this is a bar chart visualization"),
  x_axis: z
    .string()
    .describe(
      "The exact name of the column to be used for the x-axis (typically categorical)"
    ),
  y_axis: z
    .string()
    .describe(
      "The exact name of the column to be used for the y-axis (typically numeric)"
    ),
  orientation: z
    .enum(["vertical", "horizontal"])
    .describe("Orientation of the bar chart"),
  stacked: z
    .boolean()
    .default(false)
    .describe("True if the bar chart should be stacked"),
  insights: z
    .array(z.string())
    .describe("Key insights derived from the visualization"),
});

// Area Chart Visualization
const AreaChartVisualization = z.object({
  chart_type: z
    .literal("area")
    .describe("Specifies that this is an area chart visualization"),
  x_axis: z
    .string()
    .describe("The exact name of the column to be used for the x-axis"),
  y_axis: z
    .string()
    .describe("The exact name of the column to be used for the y-axis"),
  stacked: z
    .boolean()
    .default(false)
    .describe("True if the area chart should be stacked"),
  insights: z
    .array(z.string())
    .describe("Key insights derived from the visualization"),
});

const DataSummary = z.object({
  summary: z
    .string()
    .describe("A brief overview summarizing the overall trends in the data"),
  key_metrics: z
    .array(
      z.object({
        metric_name: z
          .string()
          .describe("The name of the metric, e.g., 'Total Sales'"),
        value: z.number().describe("The numerical value of the metric"),
        unit: z
          .string()
          .optional()
          .describe("Optional measurement unit, e.g., 'USD', 'kg'"),
      })
    )
    .describe(
      "A list of important quantitative metrics extracted from the data"
    ),
  insights: z
    .array(z.string())
    .describe("A list of qualitative insights derived from the analysis"),
  recommendations: z
    .array(z.string())
    .optional()
    .describe("Optional actionable recommendations based on the analysis"),
});

const Report = z.object({
  title: z.string().describe("The title of the report"),
  report: z
    .string()
    .describe(
      "A brief summary of the analysis structered in clear form and in .md format"
    ),
});

// Main Visualization Types
const VisualizationType = z
  .discriminatedUnion("chart_type", [
    LineGraphVisualization,
    PieChartVisualization,
    BarChartVisualization,
    AreaChartVisualization,
  ])
  .describe("Parameters that define how to visualize the data");

// **New: Visualization List Schema**
const VisualizationList = z
  .array(VisualizationType)
  .describe(
    "A list of visualization configurations, each defining a specific way to display the data."
  );

// Type Exports
export type TLineGraphVisualization = z.infer<typeof LineGraphVisualization>;
export type TPieChartVisualization = z.infer<typeof PieChartVisualization>;
export type TBarChartVisualization = z.infer<typeof BarChartVisualization>;
export type TAreaChartVisualization = z.infer<typeof AreaChartVisualization>;
export type TVisualizationTypes = z.infer<typeof VisualizationType>;
export type TVisualizationList = z.infer<typeof VisualizationList>;

// Schema Exports
export {
  LineGraphVisualization,
  PieChartVisualization,
  BarChartVisualization,
  AreaChartVisualization,
  VisualizationType,
  VisualizationList,
  DataSummary,
  Report,
};
