import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  LineChart, 
  MapPin, 
  Package, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Users,
  ShoppingBag,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalyticsCard } from '@/components/AnalyticsCard';

// Data from the original application
const NODE_TYPE_MAP = {
  "Walmart Store": Array.from({length: 8149}, (_, i) => `WM_${i + 1001}`),
  "Fulfillment Center": Array.from({length: 15}, (_, i) => `FC_MW${String(i + 1).padStart(2, '0')}`),
  "Dark Store": [
    ...Array.from({length: 10}, (_, i) => `DS_ATL${String(i + 1).padStart(2, '0')}`),
    ...Array.from({length: 10}, (_, i) => `DS_SJ${String(i + 1).padStart(2, '0')}`)
  ]
};

const CATEGORY_OPTIONS = [
  "Beverages", "Pet Supplies", "Grocery", "Electronics", "Home", 
  "Toys", "Clothing", "Automotive", "Pharma", "Bakery", "Produce"
];

const SAMPLE_PRODUCTS = {
  "Beverages": ["Coca-Cola 12 Pack Cans", "Pepsi 12 Pack Cans", "Great Value Apple Juice 1 Gallon"],
  "Electronics": ["Apple MacBook Core i5", "iPhone 15 128GB", "Samsung 55\" 4K Smart TV"],
  "Grocery": ["Great Value 2% Milk 1 Gallon", "Campbell's Chicken Noodle Soup 19 oz"],
  "Home": ["All Laundry Detergent 92 fl oz", "Great Value Towels 4-pack"]
};

interface OrderResult {
  status: string;
  top_combinations: Array<{
    nodes: string[];
    total_cost: number;
    sku_mapping: Record<string, string[]>;
  }>;
}

interface AdminPanelProps {
  orderResults: OrderResult | null;
  onAcceptOrder: (orderData: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ orderResults, onAcceptOrder }) => {
  const [selectedNodeType, setSelectedNodeType] = useState<string>('Walmart Store');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Beverages');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [slaType, setSlaType] = useState<string>('same-day');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedOrders, setAcceptedOrders] = useState<any[]>([]);
  const { toast } = useToast();

  const generateSKU = (category: string, productIndex: number): string => {
    return `SKU_${category.slice(0, 3).toUpperCase()}_${String(productIndex + 1).padStart(3, '0')}`;
  };

  const predictDemand = async () => {
    if (!selectedNodeId || !selectedProduct || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields for prediction",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const datetime = new Date(`${selectedDate}T${selectedTime}`);
      const products = SAMPLE_PRODUCTS[selectedCategory as keyof typeof SAMPLE_PRODUCTS] || [];
      const productIndex = products.indexOf(selectedProduct);
      const skuId = generateSKU(selectedCategory, productIndex);

      const payload = {
        node_id: selectedNodeId,
        SKU_id: skuId,
        SLA_type: slaType,
        node_type: selectedNodeType,
        day: datetime.getDate(),
        hour: datetime.getHours(),
        weekday: datetime.getDay(),
        month: datetime.getMonth() + 1
      };

      const response = await fetch('http://localhost:5000/predict_demand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setPrediction(result.prediction);
        toast({
          title: "Prediction Complete",
          description: `Predicted demand: ${result.prediction} units`,
        });
      } else {
        throw new Error('Failed to get prediction');
      }
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Failed to connect to prediction service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const acceptOrder = (orderOption: any) => {
    setAcceptedOrders([...acceptedOrders, { ...orderOption, acceptedAt: new Date() }]);
    onAcceptOrder(orderOption);
    toast({
      title: "Order Accepted",
      description: "Order has been accepted and forwarded to fulfillment",
    });
  };

  const availableNodeIds = NODE_TYPE_MAP[selectedNodeType as keyof typeof NODE_TYPE_MAP] || [];
  const availableProducts = SAMPLE_PRODUCTS[selectedCategory as keyof typeof SAMPLE_PRODUCTS] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-glass-border rounded-none backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-walmart p-3 rounded-xl animate-pulse-glow">
              <Users className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Walmart Admin Portal
              </h1>
              <p className="text-muted-foreground text-sm">Order Management & Analytics</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{acceptedOrders.length}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-walmart-yellow">
                    {orderResults?.top_combinations?.length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-walmart-yellow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-success">
                    ${acceptedOrders.reduce((sum, order) => sum + order.total_cost, 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold text-primary">94.2%</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Order Management
            </TabsTrigger>
            <TabsTrigger value="prediction" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Demand Prediction
            </TabsTrigger>
          </TabsList>

          {/* Order Management Tab */}
          <TabsContent value="orders" className="space-y-6">
            {orderResults && orderResults.top_combinations?.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Pending Order Processing
                </h2>
                {orderResults.top_combinations.map((option, index) => (
                  <Card key={index} className="glass-card animate-slide-up hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          Option {index + 1}
                        </span>
                        <Badge variant="secondary" className="text-lg font-bold">
                          ${option.total_cost.toFixed(2)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Fulfillment Nodes</h4>
                          <div className="space-y-2">
                            {option.nodes.map((node) => (
                              <div key={node} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{node}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">SKU Distribution</h4>
                          <div className="space-y-2">
                            {Object.entries(option.sku_mapping).map(([nodeId, skus]) => (
                              <div key={nodeId} className="p-2 bg-muted/20 rounded-lg">
                                <p className="text-sm font-medium text-primary">{nodeId}</p>
                                <p className="text-xs text-muted-foreground">
                                  {Array.isArray(skus) ? skus.join(', ') : skus}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="walmart-primary"
                          onClick={() => acceptOrder(option)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Pending Orders</h3>
                  <p className="text-muted-foreground">Orders from customers will appear here for processing</p>
                </CardContent>
              </Card>
            )}

            {/* Accepted Orders */}
            {acceptedOrders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-success">Accepted Orders</h3>
                {acceptedOrders.map((order, index) => (
                  <Card key={index} className="glass-card border-success/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <div>
                            <p className="font-medium">Order {index + 1}</p>
                            <p className="text-sm text-muted-foreground">
                              Accepted at: {order.acceptedAt.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">${order.total_cost.toFixed(2)}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Demand Prediction Tab */}
          <TabsContent value="prediction" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Demand Prediction Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nodeType">Node Type</Label>
                      <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
                        <SelectTrigger className="bg-glass-bg border-glass-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(NODE_TYPE_MAP).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="nodeId">Node ID</Label>
                      <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
                        <SelectTrigger className="bg-glass-bg border-glass-border">
                          <SelectValue placeholder="Select Node ID" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableNodeIds.slice(0, 20).map((nodeId) => (
                            <SelectItem key={nodeId} value={nodeId}>{nodeId}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Product Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-glass-bg border-glass-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="product">Product</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="bg-glass-bg border-glass-border">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((product) => (
                            <SelectItem key={product} value={product}>{product}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sla">SLA Type</Label>
                      <Select value={slaType} onValueChange={setSlaType}>
                        <SelectTrigger className="bg-glass-bg border-glass-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same-day">Same Day</SelectItem>
                          <SelectItem value="next-day">Next Day</SelectItem>
                          <SelectItem value="two-day">Two Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-glass-bg border-glass-border"
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="bg-glass-bg border-glass-border"
                      />
                    </div>

                    <Button
                      variant="walmart-primary"
                      size="lg"
                      onClick={predictDemand}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Predicting...' : 'Predict Demand'}
                    </Button>
                  </div>
                </div>

                {/* Prediction Results with Enhanced Analytics */}
                {prediction !== null && (
                  <div className="space-y-6 animate-slide-up">
                    <Card className="glass-card border-success/20">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <TrendingUp className="w-12 h-12 text-success mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-success mb-2">
                            Predicted Demand: {prediction} units
                          </h3>
                          <p className="text-muted-foreground">
                            Based on historical data and current parameters
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Enhanced Analytics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <AnalyticsCard 
                        data={{
                          title: "Historical Average",
                          value: Math.max(1, prediction - 2),
                          unit: "units",
                          trend: "neutral",
                          chartData: [prediction - 3, prediction - 2, prediction - 1, prediction - 2, prediction]
                        }}
                      />
                      <AnalyticsCard 
                        data={{
                          title: "Current Prediction",
                          value: prediction,
                          unit: "units",
                          trend: "up",
                          trendValue: 12,
                          chartData: [prediction - 5, prediction - 3, prediction - 1, prediction + 1, prediction]
                        }}
                      />
                      <AnalyticsCard 
                        data={{
                          title: "Confidence Score",
                          value: 92,
                          unit: "%",
                          trend: "up",
                          trendValue: 5,
                          chartData: [88, 90, 91, 92, 92]
                        }}
                      />
                    </div>

                    {/* Additional Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <AnalyticsCard 
                        data={{
                          title: "Peak Demand Window",
                          value: new Date(`${selectedDate}T${selectedTime}`).getHours(),
                          unit: ":00 - " + (new Date(`${selectedDate}T${selectedTime}`).getHours() + 2) + ":00",
                          trend: "up",
                          trendValue: 15
                        }}
                      />
                      <AnalyticsCard 
                        data={{
                          title: "Inventory Recommendation",
                          value: Math.ceil(prediction * 1.2),
                          unit: "units",
                          trend: "up",
                          trendValue: 20,
                          chartData: [prediction, prediction * 1.1, prediction * 1.15, prediction * 1.2, prediction * 1.2]
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};