import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, RefreshCw, ArrowRight, AlertTriangle } from "lucide-react";

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  usdValue: string;
  icon: string;
}

interface TokenValidationProps {
  token: Token;
  amount: string;
  onNext: () => void;
  onBack: () => void;
  onSwap: () => void;
}

export function TokenValidation({ token, amount, onNext, onBack, onSwap }: TokenValidationProps) {
  const [validationStep, setValidationStep] = useState(0);
  const [hasWinr, setHasWinr] = useState(token.id === 'winr');
  const [progress, setProgress] = useState(0);

  const validationSteps = [
    "Checking token balance...",
    "Verifying wINR availability...",
    "Calculating conversion rates...",
    "Validation complete"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setValidationStep(3), 500);
          return 100;
        }
        setValidationStep(Math.floor(newProgress / 25));
        return newProgress;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const renderValidationContent = () => {
    if (validationStep < 3) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Validating Token</h3>
            <p className="text-muted-foreground">{validationSteps[validationStep]}</p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      );
    }

    if (hasWinr) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">Validation Successful</h3>
            <p className="text-muted-foreground">You have sufficient wINR for this transaction</p>
          </div>
          
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-success">Direct Payment Available</p>
                  <p className="text-sm text-muted-foreground">No conversion needed</p>
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Instant
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button variant="gradientSuccess" size="lg" className="w-full" onClick={onNext}>
            <ArrowRight className="w-5 h-5" />
            Proceed to Transaction
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-warning mb-4" />
          <h3 className="text-lg font-semibold mb-2">SWAP Required</h3>
          <p className="text-muted-foreground">
            Convert {token.symbol} to wINR for payment processing
          </p>
        </div>

        <Card className="bg-warning/10 border-warning/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">From: {token.symbol}</span>
              <span className="text-sm">{amount} INR equivalent</span>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">To: wINR</span>
              <span className="text-sm">{amount} wINR</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button variant="warning" onClick={onSwap}>
            Perform SWAP
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
            Token Validation
          </CardTitle>
          <CardDescription>
            Verifying {token.name} ({token.symbol}) for payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderValidationContent()}
        </CardContent>
      </Card>
    </div>
  );
}