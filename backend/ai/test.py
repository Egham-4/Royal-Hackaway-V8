from data_reporter import DataReporter

def run_example():
    # Initialize the reporter
    reporter = DataReporter()
    
    # Prepare test data with meaningful business metrics
    test_data = [
        {
            "Revenue Growth": {
                "2020": "$1M",
                "2021": "$1.5M",
                "2022": "$2.2M",
                "2023": "$3.1M"
            }
        },
        {
            "Customer Metrics": {
                "Active Users": 50000,
                "Retention Rate": "85%",
                "Customer Satisfaction": 4.8,
                "NPS Score": 72
            }
        },
        {
            "Market Performance": {
                "Market Share": "23%",
                "Competitor Rank": "#2",
                "Industry Growth": "15%",
                "Brand Value": "$500M"
            }
        }
    ]
    
    # Generate the report
    result = reporter.write_report(
        meta_data="2023 Annual Business Performance Analysis",
        data=test_data,
        business_type="Technology SaaS Company",
        num_sections=len(test_data)
    )
    
    # Display results
    print("\n=== SECTION REPORTS ===")
    for i, report in enumerate(result["sub_reports"], 1):
        print(f"\nSection {i} Analysis:")
        print("-" * 50)
        print(report)
        print("-" * 50)
    
    print("\n=== FINAL COMPREHENSIVE REPORT ===")
    print("=" * 50)
    print(result["final_report"])
    print("=" * 50)

if __name__ == "__main__":
    run_example()
