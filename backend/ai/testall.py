import json
from data_analysist import DataAnalyzerAgent

def load_json(file_path: str) -> dict:
    """Load and return JSON data from specified file path"""
    with open(file_path, 'r') as file:
        data = json.load(file)  # Using load instead of loads
    return data

# Example usage
data = load_json('/Users/attaimen/gitrepos/Royal-Hackaway-V8/backend/data_preprocessing/data_dictionary.json')
header = data["header"]
samplerow = data["sample_row"][0]
metadata = data["metadata"]

dataAnalyser = DataAnalyzerAgent()

result = dataAnalyser.analyse_data(header = header, sample_row = samplerow, 
                    metadata =  metadata, business_type = "Hotel" )

print(result["data_visualization"])