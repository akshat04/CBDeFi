import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Wallet, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface WalletConnectionProps {
  onNext: () => void;
  onBack: () => void;
}

export function WalletConnection({ onNext, onBack }: WalletConnectionProps) {
  const [connectionStep, setConnectionStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const connectionSteps = [
    "Detecting mobile wallet apps...",
    "Preparing wallet connection...",
    "Waiting for wallet selection...",
    "Connection established"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setConnectionStep(3), 500);
          return 100;
        }
        setConnectionStep(Math.floor(newProgress / 25));
        return newProgress;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const renderConnectionContent = () => {
    if (connectionStep < 3) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <Smartphone className="w-16 h-16 mx-auto text-primary mb-4" />
              <Wallet className="w-8 h-8 absolute -bottom-1 -right-2 text-secondary animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">{connectionSteps[connectionStep]}</p>
          </div>
          <Progress value={progress} className="w-full" />
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Mobile Device Required</p>
                  <p className="text-xs text-muted-foreground">Please ensure your crypto wallet app is installed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wallet Connected</h3>
          <p className="text-muted-foreground">Ready to proceed with AML verification</p>
        </div>
        
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-success">Wallet Status: Connected</p>
                <p className="text-sm text-muted-foreground">MetaMask • 0x1234...5678</p>
              </div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button variant="gradient" onClick={onNext}>
            Continue to AML Check
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Connect your crypto wallet to proceed with the transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderConnectionContent()}
        </CardContent>
      </Card>
    </div>
  );
}