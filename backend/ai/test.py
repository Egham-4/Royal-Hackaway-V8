from data_analysist import DataAnalyzerAgent
from typing import List, Dict, Any

def main():
    print("\n=== Testing Data Analyzer Workflow ===")
    
    # Initialize test data
    test_headers = ["date", "revenue", "customer_id", "product"]
    test_sample_row = ["2024-01-01", "1000", "C123", "Widget"]
    test_metadata = {
        "date": "datetime",
        "revenue": "int",
        "customer_id": "int",
        "product": "str"
    }
    test_business_type = "e-commerce"

    # Create agent instance
    analyzer = DataAnalyzerAgent()

    # Run analysis with result checking
    result = analyzer.analyze_repo(
        header=test_headers,
        sample_row=test_sample_row,
        metadata=test_metadata,
        business_type=test_business_type
    )

    if result:
        print("\nTest Results:")
        print(f"Analysis: {result.get('analysis', 'No analysis available')}")
        print(f"Visualization Plan: {result.get('data_visualization', 'No visualization available')}")
    else:
        print("\nAnalysis completed without results")

if __name__ == "__main__":
    main()
