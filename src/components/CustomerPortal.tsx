import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, MapPin, Package, Rocket, Truck, Calendar, Plus, Minus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Static data from the original Streamlit application
const LOCATION_DATA = {
  "Midtown Atlanta": [33.7838, -84.3830],
  "Buckhead": [33.8484, -84.3781],
  "Downtown Atlanta": [33.7537, -84.3901],
  "Virginia-Highland": [33.7839, -84.3530],
  "Downtown Austin": [30.2672, -97.7431],
  "South Austin (SoCo)": [30.2500, -97.7500],
  "East Austin": [30.2672, -97.7200],
  "West Lake Hills": [30.2833, -97.8167],
  "Downtown Dallas": [32.7767, -96.7970],
  "Uptown Dallas": [32.8018, -96.8089],
  "Deep Ellum": [32.7834, -96.7806],
  "Bishop Arts District": [32.7390, -96.8217],
  "Country Club Plaza": [39.0431, -94.5906],
  "Crossroads Arts District": [39.0921, -94.5816],
  "Power & Light District": [39.1012, -94.5844],
  "Westport": [39.0539, -94.5944],
  "South Beach (Miami Beach)": [25.7823, -80.1304],
  "Downtown Miami/Brickell": [25.7617, -80.1918],
  "Coral Gables": [25.7217, -80.2581],
  "Wynwood": [25.8010, -80.1999],
  "Downtown Orlando": [28.5383, -81.3792],
  "International Drive (I-Drive)": [28.4394, -81.4677],
  "Winter Park": [28.5999, -81.3392],
  "College Park": [28.5592, -81.3453],
  "Downtown Phoenix": [33.4484, -112.0740],
  "Scottsdale": [33.4942, -111.9261],
  "Tempe": [33.4255, -111.9400],
  "Old Town Scottsdale": [33.4936, -111.9260],
  "Downtown Pittsburgh (Golden Triangle)": [40.4406, -79.9959],
  "Lawrenceville": [40.4668, -79.9600],
  "Shadyside": [40.4515, -79.9342],
  "Oakland": [40.4406, -79.9514],
  "Downtown San Francisco": [37.7749, -122.4194],
  "Silicon Valley (Palo Alto area)": [37.4419, -122.1430],
  "Oakland Bay Area": [37.8044, -122.2712],
  "Berkeley": [37.8715, -122.2730],
  "Downtown Tampa": [27.9506, -82.4572],
  "Ybor City": [27.9659, -82.4374],
  "Hyde Park": [27.9356, -82.4618],
  "Westshore": [27.9506, -82.5168],
  "Downtown D.C./Penn Quarter": [38.8951, -77.0269],
  "Georgetown": [38.9076, -77.0723],
  "Dupont Circle": [38.9097, -77.0434],
  "Capitol Hill": [38.8899, -76.9951],
  "Bentonville": [36.3729, -94.2088],
  "Fayetteville": [36.0625, -94.1574],
  "Rogers": [36.3320, -94.1185],
  "Springdale": [36.1867, -94.1288],
  "Uptown Charlotte": [35.2271, -80.8431],
  "South End": [35.2080, -80.8414],
  "NoDa (North Davidson)": [35.2504, -80.8111],
  "Dilworth": [35.2080, -80.8531],
  "Downtown Houston": [29.7604, -95.3698],
  "The Heights": [29.8024, -95.4068],
  "River Oaks": [29.7604, -95.4351],
  "Montrose": [29.7506, -95.3900]
} as const;

const CATEGORY_TO_PRODUCTS: Record<string, string[]> = {
  "Beverages": [
    "Aquafina 12 Pack Iced Tea",
    "Coca-Cola 12 Pack Cans",
    "Dr Pepper 12 Pack Cans",
    "Great Value Apple Juice 1 Gallon",
    "Great Value Orange Juice 1 Gallon",
    "Lipton 12 Pack Iced Tea",
    "Lipton 24 Pack Water",
    "Pepsi 12 Pack Cans"
  ],
  "Pet Supplies": [
    "Great Value Cat Litter 10 oz",
    "Great Value Cat Litter 25 lb",
    "Great Value Pet Treats 25 lb",
    "Kong Dog Toy",
    "Nylabone Dog Toy",
    "Pedigree Cat Food 15 lb",
    "Pedigree Dog Food 15 lb",
    "Pedigree Dog Food 20 lb",
    "Purina Cat Food 15 lb",
    "Purina Cat Food 20 lb",
    "Purina Dog Food 15 lb",
    "Purina Dog Food 20 lb"
  ],
  "Bakery": [
    "Great Value Bagels 12-pack",
    "Great Value Bread Sourdough 20 oz",
    "Great Value Bread White 20 oz",
    "Great Value Donuts 12-pack",
    "Great Value Donuts 6-pack",
    "Great Value Muffins 12-pack",
    "Great Value Muffins 6-pack",
    "Wonder Bread Sourdough 20 oz",
    "Wonder Bread Wheat 20 oz",
    "Wonder Bread White 20 oz"
  ],
  "Produce": [
    "Apples 1 lb container",
    "Apples per lb",
    "Bananas 1 lb container",
    "Bananas per lb",
    "Blueberries 1 lb container",
    "Carrots per lb",
    "Kale 1 head",
    "Kale 5 oz bag",
    "Lettuce 1 head",
    "Lettuce 5 oz bag",
    "Oranges 1 lb container",
    "Oranges per lb",
    "Potatoes 5 lb bag",
    "Potatoes per lb",
    "Spinach 1 head",
    "Spinach 5 oz bag",
    "Strawberries 1 lb container",
    "Strawberries per lb",
    "Sweet Potatoes 5 lb bag"
  ],
  "Pharma": [
    "Advil Allergy Relief 100 ct",
    "Advil Pain Reliever 50 ct",
    "Band-Aid Adhesive Bandages 60 ct",
    "Colgate Toothpaste 6 oz",
    "Crest Toothpaste 6 oz",
    "Dove Deodorant 4-pack",
    "Dove Razor Blades 13.5 oz",
    "Gerber Baby Food 8 oz",
    "Gerber Cereal 8 oz",
    "Gillette Deodorant 13.5 oz",
    "Gillette Razor Blades 4-pack",
    "Great Value Baby Formula 24 oz",
    "Great Value Baby Formula 800 ct",
    "Great Value Baby Wipes 800 ct",
    "Great Value Conditioner 20 oz",
    "Great Value Shampoo 20 oz",
    "Great Value Supplements Multivitamin 120 ct",
    "Great Value Supplements Omega-3 120 ct",
    "Great Value Vitamins Multivitamin 120 ct",
    "Great Value Vitamins Omega-3 120 ct",
    "Huggies Diapers Size 3 120 ct",
    "Huggies Diapers Size 5 100 ct",
    "Huggies Diapers Size 5 120 ct",
    "Old Spice Body Wash 4-pack",
    "Old Spice Razor Blades 4-pack",
    "Pampers Diapers Size 3 120 ct",
    "Pampers Diapers Size 5 100 ct",
    "Tylenol Allergy Relief 100 ct",
    "Tylenol Pain Reliever 50 ct",
    "Zyrtec Allergy Relief 50 ct",
    "Zyrtec Pain Reliever 50 ct"
  ],
  "Grocery": [
    "Campbell's Chicken Noodle Soup 19 oz",
    "Campbell's Vegetable Soup 19 oz",
    "Chicken Breast 80/20 per lb",
    "Chicken Breast Boneless per lb",
    "Great Value 2% Milk 1 Gallon",
    "Great Value 2% Milk Half Gallon",
    "Great Value Bacon 12 oz",
    "Great Value Beans 10.5 oz",
    "Great Value Beans 15 oz",
    "Great Value Brownies 12 oz",
    "Great Value Canned Fruit 15 oz",
    "Great Value Cereal 16 oz",
    "Great Value Cereal 2 lb",
    "Great Value Cheddar Cheese 16 oz",
    "Great Value Cheddar Cheese 8 oz",
    "Great Value Chicken Nuggets 16 oz",
    "Great Value Chicken Nuggets 48 oz",
    "Great Value Cookies 12 oz",
    "Great Value Flour 5 lb",
    "Great Value Frozen Vegetables 12 oz",
    "Great Value Greek Yogurt 32 oz",
    "Great Value Greek Yogurt 6 oz 4-pack",
    "Great Value Ice Cream 16 oz",
    "Great Value Ice Cream 32 oz",
    "Great Value Mozzarella Cheese 8 oz",
    "Great Value Pasta 2 lb",
    "Great Value Pasta 32 oz",
    "Great Value Pizza 16 oz",
    "Great Value Pizza 32 oz",
    "Great Value Pizza 48 oz",
    "Great Value Rice 16 oz",
    "Great Value Rice 2 lb",
    "Great Value Sausage 12 oz",
    "Great Value Skim Milk 1 Gallon",
    "Great Value Soup 10.5 oz",
    "Great Value Yogurt 6 oz 4-pack",
    "Ground Beef Boneless per lb",
    "Kelloggs Corn Flakes 18 oz",
    "Kelloggs Oats 18 oz",
    "Lean Cuisine Lasagna 10.5 oz",
    "Lean Cuisine Mac & Cheese 10.5 oz",
    "Pork Chops Boneless per lb",
    "Progresso Chicken Noodle Soup 19 oz",
    "Progresso Vegetable Soup 19 oz",
    "Quaker Corn Flakes 18 oz",
    "Quaker Oats 18 oz",
    "Salmon Fillet per lb",
    "Stouffer's Lasagna 10.5 oz",
    "Stouffer's Mac & Cheese 10.5 oz",
    "Tilapia Fillet per lb"
  ],
  "Automotive": [
    "Armor All Tire Shine 16 oz",
    "Castrol Motor Oil 5W-20 5 qt",
    "Great Value Car Wash 64 oz",
    "Great Value Wiper Fluid 64 oz",
    "Mobil 1 Motor Oil 5W-20 5 qt",
    "Mobil 1 Motor Oil 5W-30 5 qt"
  ],
  "Home": [
    "All Laundry Detergent 92 fl oz",
    "Angel Soft Toilet Paper 18 rolls",
    "Charmin Toilet Paper 18 rolls",
    "Charmin Toilet Paper 24 rolls",
    "Coleman Cooler 4-person",
    "Coleman Cooler 50 qt",
    "Coleman Tent 50 qt",
    "Gain Laundry Detergent 100 fl oz",
    "Gain Laundry Detergent 92 fl oz",
    "Great Value All-Purpose Cleaner 28 oz",
    "Great Value All-Purpose Cleaner 32 oz",
    "Great Value Bed Sheets 4-pack",
    "Great Value Bed Sheets Queen Size",
    "Great Value Dish Soap 28 oz",
    "Great Value Dish Soap 32 oz",
    "Great Value Pans & Pans Set",
    "Great Value Pots & Pans Set",
    "Great Value Towels 4-pack",
    "Great Value Towels Queen Size",
    "Instant Pot Air Fryer",
    "Instant Pot Pressure Cooker",
    "Instant Pot Stand Mixer",
    "KitchenAid Air Fryer",
    "KitchenAid Pressure Cooker",
    "KitchenAid Stand Mixer",
    "Ninja Pressure Cooker",
    "Ozark Trail Tent 4-person",
    "Ozark Trail Tent 50 qt",
    "Tide Laundry Detergent 100 fl oz"
  ],
  "Toys": [
    "Barbie Blaster",
    "Barbie Building Set",
    "Great Value Basketball",
    "Great Value Board Game 1000 pieces",
    "Great Value Board Game Family",
    "Great Value Puzzle 1000 pieces",
    "Great Value Puzzle Family",
    "Great Value Soccer Ball",
    "Hot Wheels Car Set 5-pack",
    "Huffy Bicycle Accessories",
    "LEGO Blaster",
    "LEGO Building Set",
    "LEGO Doll",
    "Nerf Blaster",
    "Nerf Building Set",
    "Nerf Doll",
    "Schwinn Bicycle Accessories"
  ],
  "Electronics": [
    "Apple Laptop Core i5",
    "Apple MacBook Core i5",
    "Apple MacBook Core i7",
    "Apple MacBook M2",
    "Dell Laptop Core i7",
    "Dell Laptop M2",
    "Google Pixel 8 128GB",
    "Google Pixel 8 256GB",
    "HP MacBook M2",
    "LG 55\" 4K Smart TV",
    "LG 65\" 4K Smart TV",
    "LG 75\" 4K Smart TV",
    "Samsung 55\" 4K Smart TV",
    "TCL 75\" 4K Smart TV",
    "iPhone 15 128GB"
  ],
  "Clothing": [
    "Adidas Hoodie",
    "Adidas Running Shoes",
    "Great Value Socks 3-pack",
    "Great Value Socks 6-pack",
    "Great Value T-Shirt 3-pack",
    "Great Value T-Shirt 6-pack",
    "Hanes 501 Jeans Men",
    "Hanes 501 Jeans s",
    "Hanes Slim Fit Shirt s",
    "Levis 501 Jeans s",
    "Levis Slim Fit Shirt Men",
    "Nike Running Shoes",
    "Wrangler 501 Jeans Men",
    "Wrangler Slim Fit Shirt Women",
    "Wrangler Slim Fit Shirt s"
  ]
};

interface CartItem {
  sku: string;
  product: string;
  category: string;
  quantity: number;
}

interface CustomerPortalProps {
  onOrderPlaced: (orderData: any) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onOrderPlaced }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [deliveryOption, setDeliveryOption] = useState<'same-day' | 'next-day' | 'flexible'>('same-day');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Generate SKU for product
  const generateSKU = (category: string, productIndex: number): string => {
    return `SKU_${category.slice(0, 3).toUpperCase()}_${String(productIndex + 1).padStart(3, '0')}`;
  };

  // Add product to cart
  const addToCart = (product: string, category: string) => {
    const categoryProducts = CATEGORY_TO_PRODUCTS[category as keyof typeof CATEGORY_TO_PRODUCTS] || [];
    const productIndex = categoryProducts.indexOf(product);
    const sku = generateSKU(category, productIndex);

    const existingItem = cart.find(item => item.sku === sku);
    if (existingItem) {
      setCart(cart.map(item => 
        item.sku === sku 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { sku, product, category, quantity: 1 }]);
    }

    toast({
      title: "Added to Cart",
      description: `${product} added to your cart`,
    });
  };

  // Update cart quantity
  const updateQuantity = (sku: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setCart(cart.map(item => 
      item.sku === sku 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Remove from cart
  const removeFromCart = (sku: string) => {
    setCart(cart.filter(item => item.sku !== sku));
  };

  // Place order
  const placeOrder = async () => {
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please select a delivery location",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const coordinates = LOCATION_DATA[selectedLocation as keyof typeof LOCATION_DATA];
      const requestedSkus = cart.map(item => item.sku);
      
      const payload = {
        requested_skus: requestedSkus,
        location: {
          area: selectedLocation,
          latitude: coordinates[0],
          longitude: coordinates[1]
        }
      };

      const response = await fetch('http://localhost:5000/process_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        onOrderPlaced(result);
        setCart([]);
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been processed and sent to fulfillment",
        });
      } else {
        throw new Error('Failed to process order');
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Failed to connect to backend service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const DeliveryIcon = ({ option }: { option: string }) => {
    switch (option) {
      case 'same-day': return <Rocket className="w-5 h-5" />;
      case 'next-day': return <Truck className="w-5 h-5" />;
      case 'flexible': return <Calendar className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-glass-border rounded-none backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-walmart p-3 rounded-xl animate-pulse-glow">
                <span className="text-2xl font-bold text-foreground">W</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Walmart Express
                </h1>
                <p className="text-muted-foreground text-sm">Fast & Fresh Delivery</p>
              </div>
            </div>
            <div className="relative">
              <Button variant="glass" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-walmart-yellow text-foreground animate-bounce">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Location Selection */}
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Select Delivery Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full h-12 border-glass-border bg-glass-bg backdrop-blur-sm">
                  <SelectValue placeholder="Choose your delivery area" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(LOCATION_DATA).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Delivery Options */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'same-day', label: 'Same Day', desc: 'Fast delivery' },
                  { key: 'next-day', label: 'Next Day', desc: 'Standard' },
                  { key: 'flexible', label: 'Flexible', desc: 'Economy' },
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={deliveryOption === option.key ? 'walmart-primary' : 'glass'}
                    className="h-16 flex flex-col gap-1"
                    onClick={() => setDeliveryOption(option.key as any)}
                  >
                    <DeliveryIcon option={option.key} />
                    <span className="text-xs">{option.label}</span>
                    <span className="text-xs opacity-70">{option.desc}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Shop by Category
            </h2>
            {Object.entries(CATEGORY_TO_PRODUCTS).map(([category, products]) => (
              <Card key={category} className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.slice(0, 6).map((product, index) => (
                      <div
                        key={product}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover-lift"
                      >
                        <div>
                          <p className="font-medium text-sm">{product}</p>
                          <p className="text-xs text-muted-foreground">SKU: {generateSKU(category, index)}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="walmart"
                          onClick={() => addToCart(product, category)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="space-y-6">
          <Card className="glass-card sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.sku} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.sku)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={placeOrder}
                    disabled={isLoading || cart.length === 0}
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};