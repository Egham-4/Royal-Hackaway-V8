import { Logger } from 'logging';
import { StateGraph, START, END } from 'langgraph';
import { ChatGroq } from 'langchain-groq';
import { VisualizationTypes } from './ai/visualization_types';

const logger = Logger.getLogger(__name__);

interface ImportantHeaders {
    headers: string[];
}

interface MetadataField {
    dtype: string;
    unique_values: number;
}

interface DataAnalyzerState {
    header: string[];
    sample_row: any[];
    metadata: Record<string, MetadataField>;
    data_visualization: VisualizationTypes;
    analysis: ImportantHeaders;
    business_type: string;
}

const createLLM = () => new ChatGroq({ 
    model: "llama-3.3-70b-versatile", 
    temperature: 0.1 
});

const buildAnalyserGraph = (
    dataAnalyser: (state: DataAnalyzerState) => Promise<DataAnalyzerState>,
    dataVisual: (state: DataAnalyzerState) => Promise<DataAnalyzerState>
): StateGraph<DataAnalyzerState> => {
    logger.info("Building DATA ANALYZER graph");
    const graph = new StateGraph<DataAnalyzerState>();

    graph.addNode("visualization_processor", dataVisual);
    graph.addNode("analyzer_processor", dataAnalyser);

    graph.addEdge(START, "analyzer_processor");
    graph.addEdge("analyzer_processor", "visualization_processor");
    graph.addEdge("visualization_processor", END);

    return graph;
};

const createDataAnalyser = (llm: ChatGroq) => async (
    state: DataAnalyzerState
): Promise<DataAnalyzerState> => {
    logger.info("Starting data analysis");
    const structuredLlm = llm.withStructuredOutput<ImportantHeaders>();
    const chain = dataAnalyser.pipe(structuredLlm);

    const result = await chain.invoke({
        header: state.header,
        sample_row: state.sample_row
    });
    console.log(result);
    logger.info("Data analysis completed");
    
    return {
        ...state,
        analysis: result,
    };
};

const createDataVisual = (llm: ChatGroq) => async (
    state: DataAnalyzerState
): Promise<DataAnalyzerState> => {
    logger.info("Starting visualization generation");
    const structuredLlm = llm.withStructuredOutput<VisualizationTypes>();
    const chain = visualizationPlan.pipe(structuredLlm);

    const result = await chain.invoke({
        important_headers: state.analysis,
        metadata: state.metadata,
        business_type: state.business_type
    });

    logger.info("Visualization generation completed");
    console.log(result);
    
    return {
        ...state,
        data_visualization: result,
    };
};

const analyseData = async (
    header: string[], 
    sample_row: any[], 
    metadata: Record<string, MetadataField>,
    business_type: string
): Promise<{
    analysis: ImportantHeaders;
    data_visualization: VisualizationTypes;
}> => {
    logger.info("Starting data analysis");
    
    const llm = createLLM();
    const dataAnalyser = createDataAnalyser(llm);
    const dataVisual = createDataVisual(llm);
    const graph = buildAnalyserGraph(dataAnalyser, dataVisual);

    const initial_state: DataAnalyzerState = {
        header,
        sample_row,
        metadata,
        business_type
    } as DataAnalyzerState;

    const compiledGraph = graph.compile();
    const result = await compiledGraph.invoke(initial_state);

    logger.info("Repository analysis completed");
    return {
        analysis: result.analysis,
        data_visualization: result.data_visualization
    };
};

export { analyseData, DataAnalyzerState, MetadataField, ImportantHeaders };
