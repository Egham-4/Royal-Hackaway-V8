import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def adaptive_scaling(file_path, output_path):
    """
    Loads a dataset, detects numerical columns, and applies MinMax scaling 
    dynamically based on the dataset's value distribution.
    
    - If all numerical values are ≤ 12, it still scales them.
    - If some values are > 13, only large-value columns are scaled while categorical-like numbers are kept unchanged.
    """
    # Load dataset
    data = pd.read_csv(file_path)

    # Identify numerical columns
    numeric_cols = data.select_dtypes(include=['int64', 'float64']).columns

    # Identify categorical-like numeric columns (small range or binary values)
    categorical_numerics = [
        col for col in numeric_cols 
        if data[col].nunique() <= 12 or set(data[col].unique()).issubset({0, 1})  # Small range or binary
    ]

    # Identify unique identifier columns (columns where all values are unique)
    identifier_cols = [col for col in numeric_cols if data[col].nunique() == len(data)]
    
    # Identify if the entire dataset has only small values (≤ 12)
    all_values_below_12 = all(data[col].max() <= 12 for col in numeric_cols)

    # If all values are below 12, scale everything
    if all_values_below_12:
        scalable_cols = list(numeric_cols)  # Scale all numerical columns
    else:
        # Otherwise, only scale large-value columns (> 13)
        scalable_cols = [col for col in numeric_cols if data[col].max() > 13]

    # Apply Min-Max Scaling only to necessary columns
    scaler = MinMaxScaler()
    if scalable_cols:
        data[scalable_cols] = scaler.fit_transform(data[scalable_cols])

    # Save the cleaned and normalized dataset
    data.to_csv(output_path, index=False)

    print("Adaptive scaling complete. File saved at:", output_path)

# Example usage
input_file = "backend/data_preprocessing/food.csv"
output_file = "backend/data_preprocessing/scaled_food.csv"
adaptive_scaling(input_file, output_file)
