import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def adaptive_scaling(file_path, output_path):
    """
    Loads a dataset, detects numerical columns, and applies MinMax scaling 
    dynamically while excluding unique identifier columns that are sequential.
    
    - Excludes columns where all values are unique and sequential (+1 increments).
    - If all numerical values are ≤ 12, it still scales them.
    - If some values are > 13, only large-value columns are scaled while categorical-like numbers are kept unchanged.
    """
    # Load dataset
    data = pd.read_csv(file_path)
    
    # Remove rows with missing values
    data = data.dropna()
    
    # Remove fully duplicate rows
    data = data.drop_duplicates()

    # Identify numerical columns
    numeric_cols = data.select_dtypes(include=['int64', 'float64']).columns

    # Identify categorical-like numeric columns (small range or binary values)
    categorical_numerics = [
        col for col in numeric_cols 
        if data[col].nunique() <= 12 or set(data[col].unique()).issubset({0, 1})  # Small range or binary
    ]

    # Dynamically detect unique sequential identifier columns (e.g., 1,2,3,4,...N)
    unique_identifier_cols = [
        col for col in numeric_cols 
        if data[col].nunique() == len(data)  # All values are unique
        and set(data[col]) == set(range(min(data[col]), max(data[col]) + 1))  # Sequential +1 increments
    ]

    # Identify if the entire dataset has only small values (≤ 12)
    all_values_below_12 = all(data[col].max() <= 12 for col in numeric_cols)

    # If all values are below 12, scale everything (excluding unique identifiers)
    if all_values_below_12:
        scalable_cols = [col for col in numeric_cols if col not in unique_identifier_cols]
    else:
        # Otherwise, only scale large-value columns (> 13) excluding unique identifiers
        scalable_cols = [col for col in numeric_cols if data[col].max() > 13 and col not in unique_identifier_cols]

    # Apply Min-Max Scaling only to necessary columns
    scaler = MinMaxScaler()
    if scalable_cols:
        data[scalable_cols] = scaler.fit_transform(data[scalable_cols])

    # Save the cleaned and normalized dataset
    data.to_csv(output_path, index=False)

    print("Adaptive scaling complete. File saved at:", output_path)
    print(f"Excluded Unique Identifier Columns: {unique_identifier_cols}")

# Example usage
input_file = "backend/data_preprocessing/food.csv"
output_file = "backend/data_preprocessing/cleanfood.csv"
adaptive_scaling(input_file, output_file)
