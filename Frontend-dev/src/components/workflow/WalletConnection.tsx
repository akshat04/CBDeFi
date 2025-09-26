import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Wallet, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface WalletConnectionProps {
  onNext: () => void;
  onBlacklisted: () => void;
}

export function WalletConnection({ onNext, onBlacklisted }: WalletConnectionProps) {
  const [connectionStep, setConnectionStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBlacklisted] = useState(() => Math.random() < 0.1); // 10% chance for demo

  const connectionSteps = [
    "Detecting mobile wallet apps...",
    "Preparing wallet connection...",
    "Performing AML verification...",
    "Verification complete"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setConnectionStep(3);
            if (isBlacklisted) {
              setTimeout(() => onBlacklisted(), 1000);
            } else {
              setTimeout(() => onNext(), 400);
            }
          }, 500);
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

    if (isBlacklisted) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Wallet Verification Failed</h3>
            <p className="text-muted-foreground">This wallet address has been flagged by our security systems</p>
          </div>
          
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-destructive">Wallet Status: Blacklisted</p>
                  <Badge variant="destructive">
                    Blocked
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">MetaMask • 0x1234...5678</p>
                <p className="text-sm font-medium">AML Vendor: Chainalysis</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Different Wallet
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wallet Verified</h3>
          <p className="text-muted-foreground">Your wallet has passed all security checks</p>
        </div>
        
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-success">Wallet Status: Verified</p>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Active
                </Badge>
              </div>
              {/* <p className="text-sm text-muted-foreground">MetaMask • 0x1234...5678</p> */}
              <p className="text-sm font-medium">AML Vendor: Chain Analysis</p>
            </div>
          </CardContent>
        </Card>

        
        {/* <div className="text-center">
          <Button variant="gradient" onClick={onNext}>
            Continue to Payment
          </Button>
        </div> */}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-elevated">
        <CardContent className="pt-6">
          {renderConnectionContent()}
        </CardContent>
      </Card>
    </div>
  );
}