import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, AlertTriangle, CheckCircle, RefreshCw, XCircle } from "lucide-react";

interface BalanceCheckProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    balance: string;
  };
  amount: string;
  onNext: () => void;
  onBack: () => void;
  onSwapRequired: () => void;
}

export function BalanceCheck({ token, amount, onNext, onBack, onSwapRequired }: BalanceCheckProps) {
  const [checkStep, setCheckStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const normalize = (v: string) => Number(String(v).replace(/[^\d.-]/g, '').replace(/,/g, '')) || 0;
  const availableBalance = normalize(token.balance);
  const transactionAmount = normalize(amount);
  const insufficientBalance = availableBalance < transactionAmount;

  const checkSteps = [
    "Checking token balance...",
    "Verifying transaction amount...",
    "Balance verification complete"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 33.33;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setCheckStep(2), 500);
          return 100;
        }
        setCheckStep(Math.floor(newProgress / 33.33));
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderCheckContent = () => {
    if (checkStep < 2) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <Wallet className="w-12 h-12 mx-auto text-primary mb-4" />
              <RefreshCw className="w-6 h-6 absolute -top-1 -right-1 text-secondary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Balance Verification</h3>
            <p className="text-muted-foreground">{checkSteps[checkStep]}</p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      );
    }

    if (insufficientBalance) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <XCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Insufficient Balance</h3>
            <p className="text-muted-foreground">Need to perform SWAP to get wINR</p>
          </div>
          
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Balance Insufficient</p>
                  <p className="text-sm text-muted-foreground">
                    Required: ₹{amount} • Available: ₹{token.balance}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button variant="destructive" onClick={onSwapRequired}>
              Perform SWAP
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
          <h3 className="text-lg font-semibold mb-2">Balance Verified</h3>
          <p className="text-muted-foreground">Sufficient balance available for transaction</p>
        </div>
        
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Available Balance</span>
              <Badge variant="secondary" className="bg-success/20 text-success">₹{token.balance}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction Amount</span>
              <span className="text-sm">₹{amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Remaining Balance</span>
              <span className="text-sm">₹{(availableBalance - transactionAmount).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button variant="gradientSuccess" onClick={onNext}>
            Continue to Transaction Signing
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
            Balance Check
          </CardTitle>
          <CardDescription>
            Verifying token balance for transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderCheckContent()}
        </CardContent>
      </Card>
    </div>
  );
}