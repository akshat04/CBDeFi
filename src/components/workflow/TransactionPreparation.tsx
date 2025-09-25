import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CancelPaymentDialog } from "@/components/ui/cancel-payment-dialog";
import { CheckCircle, Clock, CreditCard, ArrowRight, X } from "lucide-react";

interface TransactionPreparationProps {
  amount: string;
  onProceed: () => void;
  onCancel: () => void;
}

export function TransactionPreparation({ amount, onProceed, onCancel }: TransactionPreparationProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const baseAmount = parseFloat(amount);
  const transactionFee = baseAmount * 0.01; // 1%
  const gst = transactionFee * 0.18; // 18% GST
  const totalAmount = baseAmount + transactionFee + gst;

  if (showConfirmation) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
        <Card className="glass-elevated border-success/30">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
            <CardTitle className="text-2xl text-success">
              Payment Confirmed!
            </CardTitle>
            <CardDescription>
              Your transaction has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">Transaction ID: TXN_{Date.now()}</p>
              <Badge variant="secondary" className="bg-success/20 text-success">
                Completed
              </Badge>
            </div>
            
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-success font-semibold">Success</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement:</span>
                    <span className="text-success font-semibold">Instant</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" size="lg" className="w-full" onClick={() => window.location.reload()}>
              Start New Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Transaction Summary
          </CardTitle>
          <CardDescription>
            Review your payment details before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Breakdown */}
          <Card className="bg-surface border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Amount</span>
                <span className="font-semibold">₹{baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction Fee (1%)</span>
                <span className="font-semibold">₹{transactionFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-semibold">₹{gst.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">Payment Method</p>
                  <p className="text-sm text-muted-foreground">wINR → UPI Gateway</p>
                </div>
                <Badge variant="secondary" className="ml-auto bg-primary/20 text-primary">
                  Instant Settlement
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Processing Information */}
          <div className="bg-muted/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Processing Time: Instant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">RBI Compliant & KYC Verified</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={() => setShowCancelDialog(true)}>
              <X className="w-5 h-5" />
              Cancel Payment
            </Button>
            <Button variant="gradientSuccess" size="lg" onClick={onProceed}>
              <ArrowRight className="w-5 h-5" />
              Proceed to Pay
            </Button>
          </div>
        </CardContent>
      </Card>

      <CancelPaymentDialog 
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={() => {
          setShowCancelDialog(false);
          onCancel();
        }}
      />
    </div>
  );
}