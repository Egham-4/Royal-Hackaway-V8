import pandas as pd
from sklearn.preprocessing import MinMaxScaler


def selective_scaling(file_path, output_path):

    # Load dataset
    data = pd.read_csv(file_path)

    # Identify numerical columns
    numeric_cols = data.select_dtypes(include=['int64', 'float64']).columns

    # Identify categorical-like numeric columns (small range or binary values)
    categorical_numerics = [
        col for col in numeric_cols 
        if data[col].nunique() <= 12 or set(data[col].unique()).issubset({0, 1})  # Small range or binary
    ]

    # Identify columns where any value is greater than 13 (to be scaled)
    scalable_cols = [col for col in numeric_cols if data[col].max() > 13]

    # Apply Min-Max Scaling only to necessary columns
    scaler = MinMaxScaler()
    if scalable_cols:
        data[scalable_cols] = scaler.fit_transform(data[scalable_cols])

    # Save the cleaned and normalized dataset
    data.to_csv(output_path, index=False)

    print("Data cleaning and selective normalization complete. File saved at:", output_path)

# Example usage
input_file = "backend/data_preprocessing/cleaned_cafe_sales.csv"
output_file = "backend/data_preprocessing/scaled_cafe_sales.csv"
selective_scaling(input_file, output_file)
