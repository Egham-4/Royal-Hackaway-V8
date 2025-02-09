from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from prompts import chat_prompt
import logging
from typing import TypedDict, Any, Dict

logger = logging.getLogger(__name__)

class ChatState(TypedDict):
    response: str
    report: str

class ChatBot:
    def __init__(self):
        self.llm = ChatGroq(model="deepseek-r1-distill-llama-70b", temperature=0.3)
        self.workflow = self._build_analyser_graph()
        self.memory = MemorySaver()

    def _build_analyser_graph(self) -> StateGraph:
        logger.info("Building Chat Graph")
        workflow = StateGraph(MessagesState)
        workflow.add_node("chat", self.call_model)
        workflow.add_edge(START, "chat")
        return workflow

    def call_model(self, state: MessagesState) -> MessagesState:
        messages = [SystemMessage(content=chat_prompt)] + state["messages"]
        response = self.llm.invoke(messages)
        return {"messages": state["messages"] + [response]}

    def chat(self, message: str, report: str = "", thread_id: str = "1") -> Dict[str, Any]:
        app = self.workflow.compile(checkpointer=self.memory)
        return app.invoke(
            {
                "messages": [HumanMessage(content=message)],
                "report": report
            },
            config={"configurable": {"thread_id": thread_id}}
        )


if __name__ == "__main__":
    chatbot = ChatBot()
    result = chatbot.chat("Simplify for me vector multiplication ", report="Sample report content")
    print(result)
