import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Shield, Zap, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Crypto to CBDC/UPI rails",
      description: "Pay any CBDC/UPI merchant"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Regulatory Compliant",
      description: "KYC, AML and Tax Compliance framework"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Settlement",
      description: "Real-time payments with smart contract escrow"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "e₹ backed Stablecoin",
      description: "Get wINR for direct and instant payments "
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
              CBDeFi Payment Gateway
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bridge DeFi with TradFi
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass-elevated text-center">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-center text-primary">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="glass-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Ready to get started?
            </CardTitle>
            <CardDescription className="text-lg">
              Experience seamless crypto-to-UPI payments today
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              variant="gradient" 
              size="lg"
              className="px-12 py-6 text-lg"
              onClick={() => navigate('/payment')}
            >
              <CreditCard className="w-6 h-6 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Preparing for RBI Regulatory Sandbox • Banking Partner Integration Ready</p>
        </div>
      </div>
    </div>
  );
}