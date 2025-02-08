import pandas as pd
import json

def generate_data_dictionary(file_path, output_path):

    # Load the dataset
    data = pd.read_csv(file_path)

    # Extract headers
    header = list(data.columns)
    
    # Extract first 2 rows as a sample
    sample_row = data.head(2).values.tolist()

    # Extract metadata for each header (dtype and unique count)
    metadata = {
        col: {
            "dtype": str(data[col].dtype),
            "unique_values": data[col].nunique()
        } 
        for col in data.columns
    }

    # Store extracted information in a dictionary
    extracted_data = {
        "header": header,
        "sample_row": sample_row,
        "metadata": metadata
    }

    # Save the extracted data as a JSON dictionary
    with open(output_path, "w") as f:
        json.dump(extracted_data, f, indent=4)

    print("Data dictionary generated and saved at:", output_path)

# Example usage
input_file = "backend/data_preprocessing/cleaned_hotel_book.csv"
output_file = "backend/data_preprocessing/data_dictionary.json"
generate_data_dictionary(input_file, output_file)
