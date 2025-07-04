# Static data constants
# Add your location data, node mappings, and product categories here

# === Static Location Data ===
LOCATION_DATA = {
    "Midtown Atlanta": (33.7838, -84.3830),
    "Buckhead": (33.8484, -84.3781),
    "Downtown Atlanta": (33.7537, -84.3901),
    "Virginia-Highland": (33.7839, -84.3530),
    "Downtown Austin": (30.2672, -97.7431),
    "South Austin (SoCo)": (30.2500, -97.7500),
    "East Austin": (30.2672, -97.7200),
    "West Lake Hills": (30.2833, -97.8167),
    # Add all your remaining locations here
}

NODE_TYPE_MAP = {
    "Walmart Store": [f"WM_{i}" for i in range(1001, 9150)],
    "Fulfillment Center": [f"FC_MW{i:02d}" for i in range(1, 16)],
    "Dark Store": [f"DS_ATL{i:02d}" for i in range(1, 11)] + [f"DS_SJ{i:02d}" for i in range(1, 11)]
}

# Updated category to products mapping
CATEGORY_TO_PRODUCTS = {
    "Beverages": [
        "Aquafina 12 Pack Iced Tea",
        "Coca-Cola 12 Pack Cans",
        "Dr Pepper 12 Pack Cans",
        # Add all your products here
    ],
    "Pet Supplies": [
        "Great Value Cat Litter 10 oz",
        "Great Value Cat Litter 25 lb",
        # Add all your products here
    ],
    # Add all your categories here
}