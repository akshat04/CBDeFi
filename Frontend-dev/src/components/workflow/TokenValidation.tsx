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
  balance: number;
  inrValue: number;
  icon: string;
}

interface TokenValidationProps {
  token: Token;
  amount: string;
  onNext: () => void;
  onBack: () => void;
  onSwap: () => void;
  onConfirmPayment: () => void;
  onCancelPayment: () => void;
}

export function TokenValidation({ token, amount, onNext, onBack, onSwap, onConfirmPayment, onCancelPayment }: TokenValidationProps) {
  const [validationStep, setValidationStep] = useState(0);
  const [hasWinr, setHasWinr] = useState(token.id === 'winr');
  const [progress, setProgress] = useState(0);
  const [slippage, setSlippage] = useState("0.5");

  // Calculate transaction details
  const paymentAmount = parseFloat(amount);
  const transactionFee = 1;
  const gst = transactionFee * 0.18;
  const totalAmount = paymentAmount + transactionFee + gst;

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

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-lg">Transaction Summary (INR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Payment Amount</span>
                <span>₹{paymentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Fee</span>
                <span>₹{transactionFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onCancelPayment}>
              Cancel Payment
            </Button>
            <Button variant="gradient" onClick={onConfirmPayment}>
              Confirm Payment
            </Button>
          </div>
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

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Details (INR)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Payment Amount</span>
              <span>₹{paymentAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Fee</span>
              <span>₹{transactionFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-warning/10 border-warning/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              SWAP Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Price ({token.symbol}-wINR)</span>
                <span>
                  {token.symbol === 'ETH' ? '2,08,823.53' : 
                   token.symbol === 'BTC' ? '35,04,000.00' : 
                   token.symbol === 'USDC' ? '83.50' : '1.00'} wINR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Acceptable Slippage</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-16 px-2 py-1 text-sm border rounded text-black"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Swap Qty (in {token.symbol})</span>
                <span>
                  {token.symbol === 'ETH' ? '0.00048' : 
                   token.symbol === 'BTC' ? '0.000029' : 
                   token.symbol === 'USDC' ? '1.214' : '101.18'} {token.symbol}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onCancelPayment}>
            Cancel Payment
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