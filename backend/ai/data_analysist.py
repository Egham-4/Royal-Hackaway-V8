from typing import TypedDict, List, Any, Dict
from langgraph.graph import StateGraph, START, END
from langchain_deepseek import ChatDeepSeek
import os
import logging
from pydantic import BaseModel, Field 
from prompts import data_analyser, visualization_plan
from visualization_types import VisualizationTypes 

logger = logging.getLogger(__name__)

class ImportantHeaders(BaseModel):
    headers: List[str] = Field(description="List of important headers")

class MetadataField(TypedDict):
    dtype: str
    unique_values: int

class DataAnalyzerState(TypedDict):
    header: List[str]
    sample_row: List[Any]
    metadata: Dict[str, MetadataField]
    data_visualization: VisualizationTypes
    analysis: ImportantHeaders
    business_type: str

class DataAnalyzerAgent:
    def __init__(self):
        self.llm = ChatDeepSeek(
        model="deepseek-reasoner",
        temperature=0.1,
        api_key=os.getenv("DEEPSEEK_API_KEY")  # Fetch API key from environment
)

    def _build_analyser_graph(self) -> StateGraph:
        logger.info("Building DATA ANALYZER graph")
        graph = StateGraph(DataAnalyzerState)
        
        # Use distinct node names
        graph.add_node("visualization_processor", self.data_visual)
        graph.add_node("analyzer_processor", self.data_analyser)
        
        graph.add_edge(START, "analyzer_processor")
        graph.add_edge("analyzer_processor", "visualization_processor")
        graph.add_edge("visualization_processor", END)
        
        return graph
        
        r

    def data_analyser(self, state: DataAnalyzerState) -> DataAnalyzerState:
        logger.info("Starting data analysis")
        structured_llm = self.llm.with_structured_output(ImportantHeaders)
        chain = data_analyser | structured_llm
        
        result = chain.invoke({
            "header": state["header"],
            "sample_row": state["sample_row"]
        })
        
        logger.info("Data analysis completed")
        return {
            **state,
            "analysis": result,
        }
    
    def data_visual(self, state: DataAnalyzerState) -> DataAnalyzerState:
        logger.info("Starting visualization generation")
        structured_llm = self.llm.with_structured_output(VisualizationTypes)
        chain = visualization_plan | structured_llm
        
        result = chain.invoke({
            "important_headers": state["analysis"],
            "metadata": state["metadata"],
            "business_type": state["business_type"]
        })
        
        logger.info("Visualization generation completed")
        return {
            **state,
            "data_visualization": result,
        }

    def write_report(self, header: List[str], sample_row: List[Any], 
                    metadata: Dict[str, str], business_type: str) -> Dict[str, Any]:
        logger.info("Starting repository analysis")
        
        initial_state = {
            "header": header,
            "sample_row": sample_row,
            "metadata": metadata,
            "analysis": "",
            "business_type": business_type
        }

        compiled_graph = self.graph.compile()
        result = compiled_graph.invoke(initial_state)
        
        logger.info("Repository analysis completed")
        return {
            "analysis": result["analysis"],
            "data_visualization": result["data_visualization"]
        }