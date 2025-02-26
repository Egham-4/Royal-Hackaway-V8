import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
  } from "@langchain/core/prompts";

export const data_analyser_prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a data analyst with expertise in identifying key features in datasets. Your task is to determine the most important columns for analysis based on the given dataset structure. Prioritize:
    1. Columns with numerical or datetime data that are crucial for trends and insights
    2. Features that directly impact business decisions based on metadata
    3. Columns that provide unique identifiers or categorical context when necessary

    Return only the exact column names in order of importance, from most to least.`
        ),
    HumanMessagePromptTemplate.fromTemplate(
            `Analyze the given dataset structure and identify the most critical columns based on their relevance:
    - **Header:** {header}
    - **Sample Row:** {sample_row}

    Choose only the most essential columns for analysis—less is more.`
        )
    ]);



    export const data_visualizer_prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are a data visualization expert. Your task is to generate an optimal visualization plan for a dataset based on its key columns, metadata, and business context.
        
        You will determine the best way to represent the data, considering:
        1. The relationships between numerical and categorical features.
        2. Whether the values should be shown as raw numbers, percentages, or aggregated summaries.
        3. The best graph types (e.g., bar chart, line chart, scatter plot, pie chart) for each relationship.
        4. The business domain to ensure relevant insights are highlighted.
    
        Return the plan in a structured JSON format with the following fields:`
      ),
      HumanMessagePromptTemplate.fromTemplate(
        `Based on the following dataset and business context, generate a structured visualization plan:
        
        - **Important Headers:** {important_headers}
        - **Metadata:** {metadata} 
        - **Business Type:** {business_type}
    
        Ensure that the plan prioritizes the most insightful visualizations for analysis.`
      )
    ]);