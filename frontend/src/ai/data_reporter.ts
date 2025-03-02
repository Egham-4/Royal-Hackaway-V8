import {
    Annotation,
    END,
    MessagesAnnotation,
    StateGraph,
  } from "@langchain/langgraph";
  import {  DataSummary, Report } from "./types";
  import {  z } from "zod";
  import { ChatGroq } from "@langchain/groq";
  import { data_summary_prompt, report_prompt } from "./prompt";
  
  // Type inference
  type TDataSummary = z.infer<typeof DataSummary>;
  type TReport = z.infer<typeof Report>;
  
  
  const inputAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    x_col: Annotation<string>(),
    x_data: Annotation<number[]>(),

    y_col: Annotation<string>(),
    y_data: Annotation<number[]>(),

    business_type: Annotation<string>(),

    analysis:Annotation<TDataSummary>()
  });
  
  const outputAnnotation = Annotation.Root({
    data_report: Annotation<TReport>(),  
  });
  
  export async function data_analyser(
    state: typeof inputAnnotation.State
  ): Promise<{ analysis: TDataSummary }> {
    console.log("Starting data analysis...");
    console.log("Input state:", {
        x_col:state.x_col,
        x_data:state.x_data,
        y_col:state.y_col,
        y_data:state.y_data,
    });
  
    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });
  
    const structllm = llm.withStructuredOutput(DataSummary);
    const chain = data_summary_prompt.pipe(structllm);
  
    try {
      const result = await chain.invoke({
        x_col:state.x_col,
        x_data:state.x_data,
        y_col:state.y_col,
        y_data:state.y_data,
      });
  
      console.log("Data analysis result:", result);
      return { analysis: result };
    } catch (error) {
      console.error("Error during data analysis:", error);
      throw new Error("Failed to analyze data");
    }
  }
    

  export async function report_writer(
    state: typeof inputAnnotation.State
  ): Promise<{ data_report: TReport }> {
    console.log("Starting data analysis...");
    console.log("Input state:", {
        analysis:state.analysis,
        business_type:state.business_type
    });
  
    const llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });
  
    const structllm = llm.withStructuredOutput(Report);
    const chain = report_prompt.pipe(structllm);
  
    try {
      const result = await chain.invoke({
        analysis:state.analysis,
        business_type:state.business_type
      });
  
      console.log("Data analysis result:", result);
      return { data_report: result };

    } catch (error) {
      console.error("Error during data analysis:", error);
      throw new Error("Failed to analyze data");
    }
  }
  
  

  
  export const workflowGraph = new StateGraph({
    input: inputAnnotation,
    output: outputAnnotation,
  })
    .addNode("data_analyser", data_analyser)
    .addNode("data_reporter", report_writer )
    .addEdge("__start__", "data_analyser")
    .addEdge("data_analyser", "data_reporter")
    .addEdge("data_reporter", END);
  
  console.log("Workflow graph initialized successfully");
  


  export async function testWorkflow() {
    console.log("Starting workflow test...");
  
    const testInput = {
      x_col: "date",
      x_data: [20240101, 20240102, 20240103], // Example numeric encoding of dates
      y_col: "sales",
      y_data: [1500, 1800, 2000], // Example sales data
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
    
  