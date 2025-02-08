
import numpy as np
from datetime import datetime, timedelta
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, make_scorer
from sklearn.pipeline import make_pipeline

def enhanced_predictor(X, Y, forecast_percent=0.2, extended_features=True):
    """
    Advanced predictor that tests multiple models and selects the best one.
    
    Returns:
    - X_new (list): Future dates
    - Y_hat (list): Predictions
    - best_model_name (str): Name of the best-performing model
    - validation_score (float): Best model's RMSE score
    """
    
    # ===== 1. Feature Engineering =====
    dates = [datetime.strptime(x, "%Y-%m-%d") for x in X]
    start_date = min(dates)
    
    # Base temporal feature
    X_numeric = np.array([(d - start_date).days / 30 for d in dates]).reshape(-1, 1)
    
    if extended_features:
        # Add cyclical month features (sine/cosine)
        months = np.array([d.month for d in dates]).reshape(-1, 1)
        cyclical_months = np.hstack([np.sin(2*np.pi*months/12), 
                                   np.cos(2*np.pi*months/12)])
        
        X_processed = np.hstack([X_numeric, cyclical_months])
    else:
        X_processed = X_numeric
        
    # Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_processed)
    
    # ===== 2. Model Selection =====
    models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0),
        "Random Forest": RandomForestRegressor(n_estimators=100),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100)
    }
    
    # Time-series cross-validation (3 splits)
    tscv = TimeSeriesSplit(n_splits=3)
    rmse_scorer = make_scorer(lambda y, y_pred: np.sqrt(mean_squared_error(y, y_pred)))
    
    best_score = np.inf
    best_model = None
    best_name = ""
    
    for name, model in models.items():
        pipeline = make_pipeline(StandardScaler(), model)
        scores = cross_val_score(pipeline, X_scaled, Y, 
                               cv=tscv, scoring=rmse_scorer)
        avg_rmse = np.mean(scores)
        
        if avg_rmse < best_score:
            best_score = avg_rmse
            best_model = model
            best_name = name
            
    # ===== 3. Forecasting =====
    # Train best model on full data
    best_model.fit(X_scaled, Y)
    
    # Generate future dates
    total_months = (max(dates) - start_date).days / 30
    forecast_steps = int(np.ceil(total_months * forecast_percent))
    last_date = max(dates)
    
    future_dates = []
    future_features = []
    for i in range(1, forecast_steps + 1):
        new_date = last_date + timedelta(days=30*i)
        future_dates.append(new_date.strftime("%Y-%m-%d"))
        
        # Create features for prediction
        months_since_start = (new_date - start_date).days / 30
        if extended_features:
            month = new_date.month
            cyclical = [np.sin(2*np.pi*month/12), np.cos(2*np.pi*month/12)]
            features = np.array([[months_since_start, cyclical[0], cyclical[1]]])
        else:
            features = np.array([[months_since_start]])
            
        future_features.append(scaler.transform(features))
        
    # Predict
    Y_hat = best_model.predict(np.vstack(future_features)).tolist()
    
    return future_dates, Y_hat, best_name, best_score

# ===== Usage Example =====
if __name__ == "__main__":
    # Sample data with seasonality
    X_dates = [f"2023-{m:02d}-01" for m in range(1, 13)] + \
             [f"2024-{m:02d}-01" for m in range(1, 13)]
    Y_revenue = [10000 + 5000*abs(np.sin(m/2)) + 2000*(m%12) for m in range(24)]
    
    future_dates, predictions, best_model, score = enhanced_predictor(
        X_dates, Y_revenue, forecast_percent=0.25
    )
    
    print(f"Best Model: {best_model} (Validation RMSE: {score:.2f})")
    print("Forecast:")
    for date, pred in zip(future_dates, predictions):
        print(f"{date}: ${pred:.2f}")