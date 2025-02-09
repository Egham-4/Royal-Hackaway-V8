from typing import TypedDict, List, Any, Dict
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
import logging
from pydantic import BaseModel, Field
from prompts import business_data_analysis, final_business_report, summary_prompt, steps_prompt
from visualization_types import VisualizationTypes
from langchain_core.prompts import ChatPromptTemplate

logger = logging.getLogger(__name__)


class SMLSteps(BaseModel):
    short: str = Field(description="short steps/strategies..")
    medium: str = Field(description="medium steps/strategies..")
    long: str = Field(description="long steps/strategies..")

class DataReporterState(TypedDict):
    meta_data: str
    report: str
    sub_reports: List[str]
    final_report: str
    data: List[Any]
    business_type: str
    current_section: int
    total_sections: int
    summary :str
    key_insight:str
    steps:SMLSteps

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
        graph.add_node("summary_write",self.summary_write)
        graph.add_node("insights",self.insights)
        graph.add_node("gen_steps",self.steps)
        
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
        graph.add_edge("generate_final_report", "summary_write")
        graph.add_edge("summary_write","gen_steps")
        graph.add_edge("gen_steps",END)
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
    
    
    def summary_write(self, state: DataReporterState) -> DataReporterState:

        prompt = ChatPromptTemplate.from_messages(summary_prompt)
        
        chain = prompt | self.llm
        
        result = chain.invoke({
            "report_text": state["final_report"],
        })
        
        return {
            **state,
            "summary": str(result.content)
        }

    def insights(self, state: DataReporterState) -> DataReporterState:

        prompt = ChatPromptTemplate.from_messages(summary_prompt)
        
        chain = prompt | self.llm
        
        result = chain.invoke({
            "report_text": state["final_report"],
        })
        
        return {
            **state,
            "key_insight": str(result.content)
        }
    
    def steps(self, state: DataReporterState) -> DataReporterState:

        prompt = ChatPromptTemplate.from_messages(steps_prompt)
        structured_llm = self.llm.with_structured_output(SMLSteps)

        chain = prompt | structured_llm
        
        result = chain.invoke({
            "report_text": state["final_report"],
            "key_insight": state["key_insight"]
        })
        
        return {
            **state,
            "steps": result
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
            "data": data,
            "business_type": business_type,
            "current_section": 0,
            "total_sections": num_sections,
            "sub_reports": [],
            "final_report": "",
            "summary": "",
            "key_insight": "",
            "steps": {} 
        }

        compiled_graph = self.graph.compile()
        result = compiled_graph.invoke(initial_state)
        
        return {
            "sub_reports": result["sub_reports"],
            "final_report": result["final_report"],
            "summary":result["summary"],
            "steps":result["steps"]
        }




# -------------------------
# Sample Code to Test DataReporter with Sample Data
# -------------------------
if __name__ == "__main__":
    # Sample meta_data as a string
    sample_meta = "Example Corp, Q1-Q4 2023, Revenue and performance analysis."

    # Sample data: list of 3 sections
    sample_data = [
        "Section 1: Revenue increased steadily in Q1 with a 10% growth rate.",
        "Section 2: Q2 saw a dip in revenue due to external market pressures.",
        "Section 3: Revenue recovered in Q3 and continued growth into Q4."
    ]

    sample_business_type = "E-commerce"
    num_sections = 3

    # Initialize the DataReporter agent
    reporter = DataReporter()
    
    # Generate the report using the sample data
    final_output = reporter.write_report(sample_meta, sample_data, sample_business_type, num_sections)
    
    # Print the results
    print("Sub Reports:")
    for sub in final_output["sub_reports"]:
        print(f"- {sub}")
    
    print("\nFinal Report:")
    print(final_output["final_report"])
    
    print("\nSummary:")
    print(final_output["summary"])
    
    print("\nSteps:")
    print(final_output["steps"])