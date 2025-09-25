import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";

interface KYCRequirementProps {
  amount: string;
  onNext: () => void;
  onBack: () => void;
}

export function KYCRequirement({ amount, onNext, onBack }: KYCRequirementProps) {
  const numericAmount = parseFloat(amount.replace(/[^\d.]/g, ''));
  const requiresKYC = numericAmount >= 10000;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 step-fade-in">
      <Card className="glass-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            KYC Requirement Check
          </CardTitle>
          <CardDescription>
            Verification requirement for your transaction amount
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Amount Display */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Transaction Amount</p>
            <p className="text-3xl font-bold">₹{amount}</p>
          </div>

          {/* KYC Status */}
          {requiresKYC ? (
            <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-orange-700 dark:text-orange-300">
                <div className="space-y-2">
                  <p className="font-semibold">KYC Required</p>
                  <p className="text-sm">
                    Transactions of ₹10,000 or more require KYC verification as per regulatory compliance.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                <div className="space-y-2">
                  <p className="font-semibold">No KYC Required</p>
                  <p className="text-sm">
                    Transactions under ₹10,000 can proceed without KYC verification for faster processing.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* KYC Benefits */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              {requiresKYC ? "KYC Benefits" : "No-KYC Benefits"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requiresKYC ? (
                <>
                  <Badge variant="secondary" className="p-3 justify-start">
                    Higher transaction limits
                  </Badge>
                  <Badge variant="secondary" className="p-3 justify-start">
                    Enhanced security
                  </Badge>
                  <Badge variant="secondary" className="p-3 justify-start">
                    Regulatory compliance
                  </Badge>
                  <Badge variant="secondary" className="p-3 justify-start">
                    Account protection
                  </Badge>
                </>
              ) : (
                <>
                  <Badge variant="secondary" className="p-3 justify-start text-green-700 bg-green-100 dark:bg-green-950/50">
                    Instant processing
                  </Badge>
                  <Badge variant="secondary" className="p-3 justify-start text-green-700 bg-green-100 dark:bg-green-950/50">
                    No documentation
                  </Badge>
                  <Badge variant="secondary" className="p-3 justify-start text-green-700 bg-green-100 dark:bg-green-950/50">
                    Privacy focused
                  </Badge>
                  <Badge variant="secondary" className="p-3 justify-start text-green-700 bg-green-100 dark:bg-green-950/50">
                    Quick settlement
                  </Badge>
                </>
              )}
            </div>
          </div>

          {requiresKYC && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> KYC verification typically takes 2-5 minutes. You'll need to provide:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Government-issued photo ID</li>
                <li>Address proof</li>
                <li>Phone number verification</li>
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button
              variant="gradient"
              size="lg"
              className="flex-1"
              onClick={onNext}
            >
              <ArrowRight className="w-5 h-5" />
              {requiresKYC ? "Proceed with KYC" : "Continue Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}