import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QrCode, Scan, Coins, CheckCircle, XCircle, User } from "lucide-react";
import merchantsData from "@/data/merchants.json";

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  inrValue: number;
  icon: string;
}

interface PaymentInitiationProps {
  onNext: (data: { amount: string; method: 'qr' | 'manual'; phoneNumber: string; selectedToken: Token; description?: string }) => void;
}

export function PaymentInitiation({ onNext }: PaymentInitiationProps) {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'manual' | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [balanceStatus, setBalanceStatus] = useState<'checking' | 'sufficient' | 'insufficient' | null>(null);
  const [foundMerchant, setFoundMerchant] = useState<any>(null);

  // Mock token data - in real app this would be fetched from wallet
  const availableTokens: Token[] = [
    { id: "winr", name: "wINR", symbol: "wINR", balance: 250000.00, inrValue: 250000.00, icon: "🪙" },
    { id: "usdt", name: "Tether", symbol: "USDT", balance: 1250.50, inrValue: 115915.87, icon: "₮" },
    { id: "usdc", name: "USD Coin", symbol: "USDC", balance: 850.25, inrValue: 73077.98, icon: "◉" },
    { id: "eth", name: "Ethereum", symbol: "ETH", balance: 2.5, inrValue: 870393.62, icon: "Ξ" },
    { id: "btc", name: "Bitcoin", symbol: "BTC", balance: 0.025, inrValue: 242865.69, icon: "₿" }
  ];

  const checkBalance = (token: Token, paymentAmount: string) => {
    const amount = parseFloat(paymentAmount);
    const fees = amount * 0.01; // 1% fee
    const gst = fees * 0.18; // 18% of fees
    const totalRequired = amount + fees + gst;
    
    setBalanceStatus('checking');
    setTimeout(() => {
      if (token.inrValue >= totalRequired) {
        setBalanceStatus('sufficient');
      } else {
        setBalanceStatus('insufficient');
      }
    }, 1000);
  };

  const handleTokenSelect = (tokenId: string) => {
    const token = availableTokens.find(t => t.id === tokenId);
    if (token && amount) {
      setSelectedToken(token);
      checkBalance(token, amount);
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digitsOnly);
    
    // Check for merchant when phone number is complete
    if (digitsOnly.length === 10) {
      const merchant = merchantsData.find(m => m.phoneNumber === digitsOnly);
      setFoundMerchant(merchant || null);
    } else {
      setFoundMerchant(null);
    }
  };

  const handleProceed = () => {
    const isPhoneValid = paymentMethod === 'manual' ? /^\d{10}$/.test(phoneNumber) : true;
    if (amount && paymentMethod && isPhoneValid && selectedToken && balanceStatus === 'sufficient') {
      onNext({ amount, method: paymentMethod, phoneNumber, selectedToken, description });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-neon interactive-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-cyber">
            Payment Initiation
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">
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


          {/* Amount Breakdown - Show when amount is entered */}
          {amount && parseFloat(amount) > 0 && (
            <div className="space-y-3">
              <Card className="glass p-4">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Payment Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span>₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction Fee (1%):</span>
                      <span>₹{(parseFloat(amount) * 0.01).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18% of Transaction Fee):</span>
                      <span>₹{(parseFloat(amount) * 0.01 * 0.18).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-border pt-1 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>₹{(parseFloat(amount) + parseFloat(amount) * 0.01 + parseFloat(amount) * 0.01 * 0.18).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card 
                className={`cursor-not-allowed opacity-50 transition-all duration-300 ${'glass'}`}
              >
                <CardContent className="p-4 text-center">
                  <QrCode className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-semibold mb-1 text-sm">Scan QR Code</h3>
                  <p className="text-xs text-muted-foreground">
                    Currently disabled
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
                <CardContent className="p-4 text-center">
                  <Coins className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <h3 className="font-semibold mb-1 text-sm">Enter Mobile Number</h3>
                  <p className="text-xs text-muted-foreground">
                    Enter recipient's mobile number
                  </p>
                </CardContent>
              </Card>
            </div>
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
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                className="h-12 text-lg glass"
              />
              {phoneNumber && !/^\d{10}$/.test(phoneNumber) && (
                <p className="text-sm text-destructive">Enter exactly 10 digits.</p>
              )}
              
              {/* Merchant Details */}
              {foundMerchant && (
                <Card className="p-4 glass-neon neon-glow">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                      <AvatarImage src={foundMerchant.profilePicture} alt={foundMerchant.name} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base text-glow">{foundMerchant.name}</h3>
                      <p className="text-sm text-muted-foreground">{foundMerchant.businessName}</p>
                      <p className="text-xs text-muted-foreground">+91 {phoneNumber}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Payment Description */}
          {paymentMethod === 'manual' && foundMerchant && (
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Payment Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Add a note for this payment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass"
                rows={3}
              />
            </div>
          )}

          {/* Token Selection */}
          {amount && paymentMethod && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Token</Label>
              <Select onValueChange={handleTokenSelect}>
                <SelectTrigger className="h-12 glass">
                  <SelectValue placeholder="Choose a cryptocurrency token" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {availableTokens.map((token) => (
                    <SelectItem key={token.id} value={token.id} className="focus:bg-accent">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{token.icon}</span>
                          <div>
                            <div className="font-medium">{token.name} ({token.symbol})</div>
                            <div className="text-sm text-muted-foreground">
                              Balance: ₹{token.inrValue.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                        {/*<div className="text-right">
                          <div className="font-medium">₹{token.inrValue.toLocaleString('en-IN')}</div>
                        </div>*/}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Balance Status */}
          {selectedToken && balanceStatus && (
            <div className="space-y-3">
              {balanceStatus === 'checking' && (
                <div className="flex items-center space-x-2 p-3 rounded-lg glass">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="text-sm">Checking balance...</span>
                </div>
              )}
              
              {balanceStatus === 'sufficient' && (
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Sufficient balance available for transaction
                  </span>
                </div>
              )}
              
              {balanceStatus === 'insufficient' && (
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-400">
                    Token balance insufficient, please choose a different token
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              variant="cyber" 
              size="lg" 
              className="flex-1"
              onClick={() => {
                setAmount("");
                setPhoneNumber("");
                setPaymentMethod(null);
                setSelectedToken(null);
                setBalanceStatus(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="premium" 
              size="lg" 
              className="flex-1"
              onClick={handleProceed}
              disabled={!amount || !paymentMethod || (paymentMethod === 'manual' && !/^\d{10}$/.test(phoneNumber)) || !selectedToken || balanceStatus !== 'sufficient'}
            >
              <Scan className="w-5 h-5" />
              Proceed to Pay
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}