import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PenTool, CheckCircle, XCircle, Clock, Lock, ArrowRight } from "lucide-react";

interface TransactionSigningProps {
  amount: string;
  onSuccess: (txHash: string) => void;
  onFailure: () => void;
  onBack: () => void;
}

export function TransactionSigning({ amount, onSuccess, onFailure, onBack }: TransactionSigningProps) {
  const [signingStep, setSigningStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userSigned, setUserSigned] = useState<boolean | null>(null);
  const [txHash] = useState("0xabcd1234efgh5678ijkl9012mnop3456qrst7890");

  const signingSteps = [
    "Preparing transaction for signature...",
    "Setting CBDeFi Smart Contract as escrow...",
    "Waiting for user signature...",
    "Processing signed transaction..."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (signingStep < 2) {
        setProgress(prev => prev + 33);
        setSigningStep(prev => prev + 1);
      } else if (signingStep === 2) {
        // Wait for user action
        setProgress(66);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [signingStep]);

  const handleSign = () => {
    setUserSigned(true);
    setProgress(100);
    setSigningStep(3);
    setTimeout(() => {
      onSuccess(txHash);
    }, 2000);
  };

  const handleReject = () => {
    setUserSigned(false);
    onFailure();
  };

  const renderSigningContent = () => {
    if (signingStep < 2) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Lock className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preparing Transaction</h3>
            <p className="text-muted-foreground">{signingSteps[signingStep]}</p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      );
    }

    if (signingStep === 2 && userSigned === null) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <PenTool className="w-12 h-12 mx-auto text-warning mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign Transaction</h3>
            <p className="text-muted-foreground">Review and sign the transaction in your wallet</p>
          </div>

          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction Amount</span>
                <span className="text-sm font-semibold">{amount} wINR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network Fee</span>
                <span className="text-sm">~0.001 ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Escrow Contract</span>
                <span className="text-sm font-mono">0x789...abc</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-sm">Total to Sign</span>
                  <span className="text-sm">{amount} wINR</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleReject}>
              Reject
            </Button>
            <Button variant="gradient" onClick={handleSign}>
              <PenTool className="w-4 h-4 mr-2" />
              Sign Transaction
            </Button>
          </div>
        </div>
      );
    }

    if (userSigned === false) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <XCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Transaction Rejected</h3>
            <p className="text-muted-foreground">Transaction was not signed by user</p>
          </div>
          
          <Button variant="outline" onClick={onBack} className="w-full">
            Go Back
          </Button>
        </div>
      );
    }

    if (userSigned === true && signingStep === 3) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">Transaction Signed</h3>
            <p className="text-muted-foreground">Processing escrow and payment details</p>
          </div>
          
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction Hash</span>
                <span className="text-xs font-mono">{txHash.slice(0, 20)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Confirmed
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Escrow Status</span>
                <Badge variant="secondary" className="bg-warning/20 text-warning">
                  Locked
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Progress value={100} className="w-full" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Transaction Signing
          </CardTitle>
          <CardDescription>
            Sign the transaction to lock funds in escrow
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderSigningContent()}
        </CardContent>
      </Card>
    </div>
  );
}