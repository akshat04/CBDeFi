import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Scan, Coins } from "lucide-react";

interface PaymentInitiationProps {
  onNext: (data: { amount: string; method: 'qr' | 'manual'; phoneNumber: string }) => void;
}

export function PaymentInitiation({ onNext }: PaymentInitiationProps) {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'manual' | null>(null);

  const handleProceed = () => {
    const isPhoneValid = paymentMethod === 'manual' ? /^\d{10}$/.test(phoneNumber) : true;
    if (amount && paymentMethod && isPhoneValid) {
      onNext({ amount, method: paymentMethod, phoneNumber });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Payment Initiation
          </CardTitle>
          <CardDescription>
            Start your crypto-to-UPI payment journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium">
              Payment Amount (INR)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-lg glass"
            />
          </div>

          {/* Phone Number Input - Only show for manual entry */}
          {paymentMethod === 'manual' && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-base font-medium">
                Mobile Number (10 digits)
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                minLength={10}
                placeholder="Enter 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhoneNumber(digitsOnly);
                }}
                className="h-12 text-lg glass"
              />
              {phoneNumber && !/^\d{10}$/.test(phoneNumber) && (
                <p className="text-sm text-destructive">Enter exactly 10 digits.</p>
              )}
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  paymentMethod === 'qr' 
                    ? 'ring-2 ring-primary bg-gradient-primary bg-opacity-10' 
                    : 'glass hover:bg-surface-elevated'
                }`}
                onClick={() => setPaymentMethod('qr')}
              >
                <CardContent className="p-6 text-center">
                  <QrCode className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan merchant's QR code for instant payment
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  paymentMethod === 'manual' 
                    ? 'ring-2 ring-primary bg-gradient-primary bg-opacity-10' 
                    : 'glass hover:bg-surface-elevated'
                }`}
                onClick={() => setPaymentMethod('manual')}
              >
                <CardContent className="p-6 text-center">
                  <Coins className="w-12 h-12 mx-auto mb-3 text-secondary" />
                  <h3 className="font-semibold mb-2">Manual Entry</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter merchant details manually
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Proceed Button */}
          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full"
            onClick={handleProceed}
            disabled={!amount || !paymentMethod || (paymentMethod === 'manual' && !/^\d{10}$/.test(phoneNumber))}
          >
            <Scan className="w-5 h-5" />
            Proceed to Token Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}