import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, RefreshCw, XCircle } from "lucide-react";

interface AMLCheckProps {
  onNext: () => void;
  onBack: () => void;
  onBlacklisted: () => void;
}

export function AMLCheck({ onNext, onBack, onBlacklisted }: AMLCheckProps) {
  const [checkStep, setCheckStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBlacklisted] = useState(Math.random() < 0.1); // 10% chance for demo

  const checkSteps = [
    "Initiating AML verification...",
    "Checking wallet against blacklists...",
    "Verifying transaction history...",
    "AML check complete"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setCheckStep(3), 500);
          return 100;
        }
        setCheckStep(Math.floor(newProgress / 25));
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderCheckContent = () => {
    if (checkStep < 3) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
              <RefreshCw className="w-6 h-6 absolute -top-1 -right-1 text-secondary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AML Verification</h3>
            <p className="text-muted-foreground">{checkSteps[checkStep]}</p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      );
    }

    if (isBlacklisted) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <XCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Transaction Declined</h3>
            <p className="text-muted-foreground">Wallet has been flagged in AML screening</p>
          </div>
          
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Blacklisted Wallet Detected</p>
                  <p className="text-sm text-muted-foreground">This wallet address has been flagged for suspicious activity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button variant="destructive" onClick={onBlacklisted}>
              Contact Support
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
          <h3 className="text-lg font-semibold mb-2">AML Check Passed</h3>
          <p className="text-muted-foreground">Wallet verified and cleared for transaction</p>
        </div>
        
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Wallet Status</span>
              <Badge variant="secondary" className="bg-success/20 text-success">Verified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge variant="secondary" className="bg-success/20 text-success">Low</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction Limit</span>
              <span className="text-sm">₹50,000</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button variant="gradientSuccess" onClick={onNext}>
            Continue to Balance Check
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
            AML Verification
          </CardTitle>
          <CardDescription>
            Anti-Money Laundering check in progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderCheckContent()}
        </CardContent>
      </Card>
    </div>
  );
}