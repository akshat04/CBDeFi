import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Coins } from "lucide-react";

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  usdValue: string;
  icon: string;
}

interface TokenSelectionProps {
  amount: string;
  onNext: (token: Token) => void;
  onBack: () => void;
}

const availableTokens: Token[] = [
  {
    id: "winr",
    name: "wINR",
    symbol: "wINR",
    balance: "20,000.00",
    usdValue: "30.12",
    icon: "🪙"
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    balance: "0.85",
    usdValue: "2,125.45",
    icon: "⟠"
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.045",
    usdValue: "1,890.20",
    icon: "₿"
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    balance: "1,250.00",
    usdValue: "1,250.00",
    icon: "💵"
  }
];

export function TokenSelection({ amount, onNext, onBack }: TokenSelectionProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Choose Your Token
          </CardTitle>
          <CardDescription>
            Select the crypto token to pay ₹{amount}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableTokens.map((token) => (
            <Card
              key={token.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedToken?.id === token.id
                  ? 'ring-2 ring-primary bg-gradient-primary bg-opacity-10'
                  : 'glass hover:bg-surface-elevated'
              }`}
              onClick={() => setSelectedToken(token)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{token.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{token.name}</h3>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{token.balance} {token.symbol}</p>
                    <p className="text-sm text-muted-foreground">${token.usdValue}</p>
                    {selectedToken?.id === token.id && (
                      <CheckCircle className="w-5 h-5 text-success mt-1 ml-auto" />
                    )}
                  </div>
                </div>
                {token.id === 'winr' && (
                  <Badge variant="secondary" className="mt-2">
                    Recommended for instant settlement
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button
              variant="gradient"
              size="lg"
              className="flex-1"
              onClick={() => selectedToken && onNext(selectedToken)}
              disabled={!selectedToken}
            >
              <ArrowRight className="w-5 h-5" />
              Validate Token
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}