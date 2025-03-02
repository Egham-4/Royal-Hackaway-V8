import {
  Annotation,
  END,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ImportantHeaders, VisualizationType } from "./types";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { data_analyser_prompt, data_visualizer_prompt } from "./prompt";

// Type inference
type ImportantHeadersType = z.infer<typeof ImportantHeaders>;
type SingleVisualization = z.infer<typeof VisualizationType>;

interface MetadataField {
  type: string;
  description: string;
  required?: boolean;
}

type Metadata = {
  [key: string]: MetadataField;
};

const inputAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  header: Annotation<string[]>(),
  sample_row: Annotation<string[]>(),
  metadata: Annotation<Metadata>(),
  analysis: Annotation<ImportantHeadersType>(),
  business_type: Annotation<string>(),
  generated_vis: Annotation<SingleVisualization[]>(),
});

const outputAnnotation = Annotation.Root({
  data_visualization: Annotation<SingleVisualization[]>(),
});

export async function data_analyser(
  state: typeof inputAnnotation.State
): Promise<{ analysis: ImportantHeadersType }> {
  console.log("Starting data analysis...");
  console.log("Input state:", {
    header: state.header,
    sample_row: state.sample_row,
  });

  const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });

  const structllm = llm.withStructuredOutput(ImportantHeaders);
  const chain = data_analyser_prompt.pipe(structllm);

  try {
    const result = await chain.invoke({
      header: state.header,
      sample_row: state.sample_row,
      business_type: state.business_type,
    });

    console.log("Data analysis result:", result);
    return { analysis: result };
  } catch (error) {
    console.error("Error during data analysis:", error);
    throw new Error("Failed to analyze data");
  }
}

// Custom duplicate-check function that uses the passed-in visualizations array.
const isDuplicate = (
  newViz: SingleVisualization,
  visualizations: SingleVisualization[]
): boolean =>
  visualizations.some((viz) => {
    if (viz.chart_type !== newViz.chart_type) return false;

    switch (newViz.chart_type) {
      case "line": {
        const lineViz = viz as Extract<SingleVisualization, { chart_type: "line" }>;
        const lineNewViz = newViz as Extract<SingleVisualization, { chart_type: "line" }>;
        return (
          lineViz.x_axis === lineNewViz.x_axis &&
          lineViz.y_axis === lineNewViz.y_axis
        );
      }
      case "bar": {
        const barViz = viz as Extract<SingleVisualization, { chart_type: "bar" }>;
        const barNewViz = newViz as Extract<SingleVisualization, { chart_type: "bar" }>;
        return (
          barViz.x_axis === barNewViz.x_axis &&
          barViz.y_axis === barNewViz.y_axis
        );
      }
      case "area": {
        const areaViz = viz as Extract<SingleVisualization, { chart_type: "area" }>;
        const areaNewViz = newViz as Extract<SingleVisualization, { chart_type: "area" }>;
        return (
          areaViz.x_axis === areaNewViz.x_axis &&
          areaViz.y_axis === areaNewViz.y_axis 
        );
      }
      case "pie": {
        const pieViz = viz as Extract<SingleVisualization, { chart_type: "pie" }>;
        const pieNewViz = newViz as Extract<SingleVisualization, { chart_type: "pie" }>;
        const sortArr = (arr: string[]) => [...arr].sort();
        return (
          JSON.stringify(sortArr(pieViz.categories)) ===
          JSON.stringify(sortArr(pieNewViz.categories))
        );
      }
      default:
        return false;
    }
  });

export async function data_visual(
  state: typeof inputAnnotation.State & { analysis: ImportantHeadersType }
): Promise<{ data_visualization: SingleVisualization[] }> {
  console.log("Starting visualization planning...");
  console.log("Input state:", { analysis: state.analysis, metadata: state.metadata });

  const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });
  const structllm = llm.withStructuredOutput(VisualizationType);
  const chain = data_visualizer_prompt.pipe(structllm);

  const visualizations: SingleVisualization[] = [];
  const maxIterations = 5; // You can adjust the number of iterations.
  let iterations = 0;

  while (iterations < maxIterations) {
    try {
      const result = await chain.invoke({
        important_headers: state.analysis,
        metadata: state.metadata,
        business_type: state.business_type,
        generated_vis: visualizations,
      });
      // If the new visualization is not a duplicate, add it.
      if (!isDuplicate(result as SingleVisualization, visualizations)) {
        visualizations.push(result as SingleVisualization);
      }
    } catch (error) {
      console.error("Error during visualization planning iteration:", iterations, error);
    }
    iterations++;
  }

  console.log("Visualization planning results:", visualizations);
  return { data_visualization: visualizations };
}

export const workflowGraph = new StateGraph({
  input: inputAnnotation,
  output: outputAnnotation,
})
  .addNode("data_analyser", data_analyser)
  .addNode("data_visual", data_visual)
  .addEdge("__start__", "data_analyser")
  .addEdge("data_analyser", "data_visual")
  .addEdge("data_visual", END);

console.log("Workflow graph initialized successfully");

export async function testWorkflow() {
  console.log("Starting workflow test...");

  const testInput = {
    header: ["date", "sales", "category", "region"],
    sample_row: ["2024-01-01", "1500", "electronics", "north"],
    metadata: {
      date: {
        type: "datetime",
        description: "Transaction date",
        required: true,
      },
      sales: {
        type: "numeric",
        description: "Sales amount",
        required: true,
      },
    },
    business_type: "retail",
  };

  console.log("Test input:", testInput);

  try {
    const graph = await workflowGraph.compile();
    const result = await graph.invoke(testInput);

    console.log("Workflow completed successfully!");
    console.log("Final output:", JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("Workflow error:", error);
    throw error;
  }
}

testWorkflow()
  .then(() => console.log("Test completed"))
  .catch((error) => console.error("Test failed:", error));
