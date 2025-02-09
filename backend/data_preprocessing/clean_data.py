import pandas as pd

def clean_data(file_path, output_path):
    # Load dataset
    data = pd.read_csv(file_path)
    
    # Remove rows with missing values
    data = data.dropna()
    
    # Remove fully duplicate rows
    data = data.drop_duplicates()
    
    # Save the cleaned dataset
    data.to_csv(output_path, index=False)
    
    print("Data cleaning complete. File saved at:", output_path)

# Example usage
input_file = "backend/data_preprocessing/dirty_cafe_sales.csv"
output_file = "backend/data_preprocessing/sales.csv"
clean_data(input_file, output_file)
