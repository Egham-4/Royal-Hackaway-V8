import {
    Annotation,
    END,
    MessagesAnnotation,
    StateGraph,
  } from "@langchain/langgraph";
  import {ImportantHeaders, VisualizationTypes} from "./types";
  import { z } from "zod";
  import { ChatGroq } from "@langchain/groq";
  import {data_analyser_prompt, data_visualizer_prompt} from "./prompt"
// Type inference
type ImportantHeadersType = z.infer<typeof ImportantHeaders>;
type VisualizationType = z.infer<typeof VisualizationTypes>;
interface MetadataField {
    // Add relevant fields for metadata
    type: string;
    description: string;
    required?: boolean;
  }
  type Metadata = {
    [key: string]: MetadataField;
  }
  // Define input annotation structure
  const inputAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    header: Annotation<string[]>,
    sample_row: Annotation<string[]>,
    metadata: Annotation<Metadata>,
    analysis: Annotation<ImportantHeadersType>,
    business_type: Annotation<string>,
  });
  
  const outputAnnotation = Annotation.Root({
    data_visualization: Annotation<VisualizationType[]>,
  });
  
// First node processor
export async function data_analyser(
    state: typeof inputAnnotation.State
  ): Promise<{ analysis: ImportantHeadersType }> {
    console.log('Starting data analysis...');
    console.log('Input state:', {
      header: state.header,
      sample_row: state.sample_row
    });
  
    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });
  
    const structllm = llm.withStructuredOutput(ImportantHeaders);
    const chain = data_analyser_prompt.pipe(structllm);
  
    const result = await chain.invoke({
      header: state.header,
      sample_row: state.sample_row
    });
  
    console.log('Data analysis result:', result);
    return { analysis: result };
  }
  
  export async function data_visual(
    state: typeof inputAnnotation.State & { analysis: ImportantHeadersType }
  ): Promise<{ data_visualization: VisualizationType[] }> { // Fix return type
    console.log("Starting visualization planning...");
    console.log("Input state:", { analysis: state.analysis, metadata: state.metadata });
  
    const llm = new ChatGroq({ model: "llama-3.3-70b-versatile", temperature: 0.2 });
    const structllm = llm.withStructuredOutput(VisualizationTypes);
    const chain = data_visualizer_prompt.pipe(structllm);
  
    const result = await chain.invoke({
      important_headers: state.analysis,
      metadata: state.metadata,
    });
  
    console.log("Visualization planning result:", result);
    return { data_visualization: result as unknown as VisualizationType[] }; // Cast result
  }
  
  // Create and export the state graph
  export const workflowGraph = new StateGraph({
    input: inputAnnotation,
    output: outputAnnotation,
  })
    .addNode("data_analyser", data_analyser)
    .addNode("data_visual", data_visual)
    .addEdge("__start__", "data_analyser")
    .addEdge("data_analyser", "data_visual")
    .addEdge("data_visual", END);
  
  console.log('Workflow graph initialized successfully');




  async function testWorkflow() {
    console.log('Starting workflow test...');
  
    const testInput = {
      header: ['date', 'sales', 'category', 'region'],
      sample_row: ['2024-01-01', '1500', 'electronics', 'north'],
      metadata: {
        date: {
          type: 'datetime',
          description: 'Transaction date',
          required: true
        },
        sales: {
          type: 'numeric',
          description: 'Sales amount',
          required: true
        }
      },
      business_type: 'retail'
    };
  
    console.log('Test input:', testInput);
  
    try {
      const graph = await workflowGraph.compile();
      const result = await graph.invoke(testInput);
      
      console.log('Workflow completed successfully!');
      console.log('Final output:', result);
      
      return result;
    } catch (error) {
      console.error('Workflow error:', error);
      throw error;
    }
  }
  
  // Run the test
  testWorkflow()
    .then(() => console.log('Test completed'))
    .catch(error => console.error('Test failed:', error));