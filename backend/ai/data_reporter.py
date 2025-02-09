from typing import TypedDict, List, Any, Dict
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
import logging
from pydantic import BaseModel, Field
from ai.prompts import business_data_analysis, final_business_report
from ai.visualization_types import VisualizationTypes

logger = logging.getLogger(__name__)

class DataReporterState(TypedDict):
    meta_data: str
    report: str
    sub_reports: List[str]
    final_report: str
    data: List[Any]
    business_type: str
    current_section: int
    total_sections: int

class DataReporter:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            streaming=True
        )
        self.graph = self._build_analyser_graph()
        self._cache = {}
        logger.info("DATA REPORTER initialized successfully")

    def _build_analyser_graph(self) -> StateGraph:
        logger.info("Building DATA ANALYZER graph")
        graph = StateGraph(DataReporterState)
        
        graph.add_node("process_section", self.process_section)
        graph.add_node("generate_final_report", self.data_reporter)

        def should_continue(state: DataReporterState) -> str:
            return "process_section" if state["current_section"] < state["total_sections"] else "generate_final_report"

        for node in [START, "process_section"]:
            graph.add_conditional_edges(
                node,
                should_continue,
                {
                    "process_section": "process_section",
                    "generate_final_report": "generate_final_report"
                }
            )

        graph.add_edge("generate_final_report", END)
        return graph

    def process_section(self, state: DataReporterState) -> DataReporterState:
        logger.info(f"Processing section {state['current_section'] + 1} of {state['total_sections']}")
        
        chain = business_data_analysis | self.llm
        result = chain.invoke({
            "metadata": state["meta_data"],
            "data": state["data"][state["current_section"]]
        })
        
        return {
            **state,
            "sub_reports": [*state["sub_reports"], str(result.content)],
            "current_section": state["current_section"] + 1
        }

    def data_reporter(self, state: DataReporterState) -> DataReporterState:
        logger.info("Generating final report")
        
        chain = final_business_report | self.llm
        result = chain.invoke({
            "business_type": state["business_type"],
            "sub_reports": state["sub_reports"]
        })
        
        return {
            **state,
            "final_report": str(result.content)
        }

    def write_report(self, meta_data: str, data: Dict[str, Any], business_type: str, num_sections: int = 3) -> Dict[str, Any]:
        logger.info("Starting report generation process")
        
        initial_state = {
            "meta_data": meta_data,
            "report": "",
            "sub_reports": [],
            "final_report": "",
            "data": data,
            "business_type": business_type,
            "current_section": 0,
            "total_sections": num_sections
        }

        compiled_graph = self.graph.compile()
        result = compiled_graph.invoke(initial_state)
        
        return {
            "sub_reports": result["sub_reports"],
            "final_report": result["final_report"]
        }



