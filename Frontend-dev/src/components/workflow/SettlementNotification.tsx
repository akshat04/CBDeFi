import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRightLeft, Building2, Flame, RefreshCw } from "lucide-react";

interface SettlementNotificationProps {
  amount: string;
  transactionHash: string;
  onClose: () => void;
  onMakeAnotherPayment: () => void;
}

export function SettlementNotification({ amount, transactionHash, onClose, onMakeAnotherPayment }: SettlementNotificationProps) {
  const [settlementStep, setSettlementStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const settlementSteps = [
    "Depositing wINR in Smart Contract Escrow...",
    "Triggering bank transfer via API...",
    "Bank processing payment to merchant...",
    "Sending transaction receipt...",
    "Notifying payment success...",
    "Burning wINR and finalizing escrow..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 16.67;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setSettlementStep(5), 500);
          return 100;
        }
        setSettlementStep(Math.floor(newProgress / 16.67));
        return newProgress;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const renderSettlementContent = () => {
    if (settlementStep < 5) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <ArrowRightLeft className="w-12 h-12 mx-auto text-primary mb-4" />
              <RefreshCw className="w-6 h-6 absolute -top-1 -right-1 text-secondary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Settlement in Progress</h3>
            <p className="text-muted-foreground">{settlementSteps[settlementStep]}</p>
          </div>
          <Progress value={progress} className="w-full" />
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Bank API Integration Active</p>
                  <p className="text-xs text-muted-foreground">Processing through banking partner</p>
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
          <h3 className="text-lg font-semibold mb-2">Settlement Complete</h3>
          <p className="text-muted-foreground">Payment successfully processed and settled</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-success mb-2" />
              <p className="text-sm font-medium text-success">Payment Sent</p>
              <p className="text-xs text-muted-foreground">₹{amount} transferred</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
              <p className="text-sm font-medium text-orange-500">wINR Burned</p>
              <p className="text-xs text-muted-foreground">Escrow finalized</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction ID</span>
              <Badge variant="secondary" className="bg-success/20 text-success font-mono text-xs">
                {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="secondary" className="bg-success/20 text-success">Settled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Settlement Time</span>
              <span className="text-sm">{new Date().toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
          <Button variant="gradientSuccess" className="w-full" onClick={onMakeAnotherPayment}>
            Make Another Payment
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
            Settlement & Notification
          </CardTitle>
          <CardDescription>
            Processing payment settlement through banking partner
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderSettlementContent()}
        </CardContent>
      </Card>
    </div>
  );
}