# Configuration settings
# Add your API keys and configuration here

import os

class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    DEBUG = True
    
    # API Keys (store these in environment variables)
    OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY') or "your_openweather_key"
    GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY') or "your_google_maps_key"
    
    # Database settings
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///walmart.db'
    
    # ML Model settings
    MODEL_PATH = "models/"
    EXCEL_FILE = "data/walmart_dataset_10000_orders.xlsx"
    
    # Business logic settings
    FUEL_PRICE_DEFAULT = 0.7
    API_DELAY = 1.0
    MAX_COMBOS = 10