from langchain.prompts import ChatPromptTemplate  # type:ignore

data_analyser = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a data analyst with expertise in identifying key features in datasets. Your task is to determine the most important columns for analysis based on the given dataset structure. Prioritize:\n"
            "1. Columns with numerical or datetime data that are crucial for trends and insights\n"
            "2. Features that directly impact business decisions based on metadata\n"
            "3. Columns that provide unique identifiers or categorical context when necessary\n\n"
            "Return only the exact column names in order of importance, from most to least.",
        ),
        (
            "human",
            "Analyze the given dataset structure and identify the most critical columns based on their relevance:\n"
            "- **Header:** {header}\n"
            "- **Sample Row:** {sample_row}\n"
            "Choose only the most essential columns for analysis—less is more.",
        ),
    ]
)



visualization_plan = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a data visualization expert. Your task is to generate an optimal visualization plan for a dataset based on its key columns, metadata, and business context. "
            "You will determine the best way to represent the data, considering:\n"
            "1. The relationships between numerical and categorical features.\n"
            "2. Whether the values should be shown as raw numbers, percentages, or aggregated summaries.\n"
            "3. The best graph types (e.g., bar chart, line chart, scatter plot, pie chart) for each relationship.\n"
            "4. The business domain to ensure relevant insights are highlighted.\n\n"
            "Return the plan in a structured JSON format with the following fields:\n"
        ),
        (
            "human",
            "Based on the following dataset and business context, generate a structured visualization plan:\n"
            "- **Important Headers:** {important_headers}\n"
            "- **Metadata:** {metadata}\n"
            "- **Business Type:** {business_type}\n\n"
            "Ensure that the plan prioritizes the most insightful visualizations for analysis.",
        ),
    ]
)
