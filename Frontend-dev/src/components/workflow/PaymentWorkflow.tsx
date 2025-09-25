import { useState } from "react";
import { PaymentInitiation } from "./PaymentInitiation";
import { KYCRequirement } from "./KYCRequirement";
import { TokenSelection } from "./TokenSelection";
import { TokenValidation } from "./TokenValidation";
import { TransactionPreparation } from "./TransactionPreparation";
import { WalletConnection } from "./WalletConnection";
import { AMLCheck } from "./AMLCheck";
import { BalanceCheck } from "./BalanceCheck";
import { TransactionSigning } from "./TransactionSigning";
import { SettlementNotification } from "./SettlementNotification";
import { StepCarousel } from "./StepCarousel";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type WorkflowStep = 'initiation' | 'kyc' | 'tokenSelection' | 'validation' | 'preparation' | 'wallet' | 'aml' | 'balance' | 'signing' | 'settlement' | 'complete';

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  usdValue: string;
  icon: string;
}

export function PaymentWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('initiation');
  const [paymentData, setPaymentData] = useState<{
    amount: string;
    method: 'qr' | 'manual';
    phoneNumber: string;
  } | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const steps = [
    { id: 'initiation', label: 'Payment Initiation', description: 'Enter amount & method' },
    { id: 'kyc', label: 'KYC Check', description: 'Verification requirement' },
    { id: 'tokenSelection', label: 'Token Selection', description: 'Choose crypto token' },
    { id: 'validation', label: 'Token Validation', description: 'Verify & validate' },
    { id: 'preparation', label: 'Transaction Review', description: 'Review & confirm' },
    { id: 'wallet', label: 'Wallet Connection', description: 'Connect wallet' },
    { id: 'aml', label: 'AML Check', description: 'Security verification' },
    { id: 'balance', label: 'Balance Check', description: 'Verify balance' },
    { id: 'signing', label: 'Transaction Signing', description: 'Sign & complete' },
    { id: 'settlement', label: 'Settlement', description: 'Process payment' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'initiation':
        return (
          <PaymentInitiation
            onNext={(data) => {
              setPaymentData(data);
              const amount = parseFloat(data.amount.replace(/[^\d.]/g, ''));
              setCurrentStep(amount >= 10000 ? 'kyc' : 'tokenSelection');
            }}
          />
        );
      
      case 'kyc':
        return (
          <KYCRequirement
            amount={paymentData?.amount || '0'}
            onNext={() => setCurrentStep('tokenSelection')}
            onBack={() => setCurrentStep('initiation')}
          />
        );
      
      case 'tokenSelection':
        return (
          <TokenSelection
            amount={paymentData?.amount || '0'}
            onNext={(token) => {
              setSelectedToken(token);
              setCurrentStep('validation');
            }}
            onBack={() => {
              const amount = parseFloat(paymentData?.amount.replace(/[^\d.]/g, '') || '0');
              setCurrentStep(amount >= 10000 ? 'kyc' : 'initiation');
            }}
          />
        );
      
      case 'validation':
        return (
          <TokenValidation
            token={selectedToken!}
            amount={paymentData?.amount || '0'}
            onNext={() => setCurrentStep('preparation')}
            onBack={() => setCurrentStep('tokenSelection')}
            onSwap={() => {
              // In a real app, this would trigger the SWAP process
              // For demo, we'll just proceed
              setCurrentStep('preparation');
            }}
          />
        );
      
      case 'preparation':
        return (
          <TransactionPreparation
            amount={paymentData?.amount || '0'}
            onProceed={() => setCurrentStep('wallet')}
            onCancel={() => setCurrentStep('initiation')}
          />
        );
      
      case 'wallet':
        return (
          <WalletConnection
            onNext={() => setCurrentStep('aml')}
            onBack={() => setCurrentStep('preparation')}
          />
        );
      
      case 'aml':
        return (
          <AMLCheck
            onNext={() => setCurrentStep('balance')}
            onBack={() => setCurrentStep('wallet')}
            onBlacklisted={() => {
              // Handle blacklisted wallet
              console.log('Wallet blacklisted');
            }}
          />
        );
      
      case 'balance':
        return (
          <BalanceCheck
            token={selectedToken!}
            amount={paymentData?.amount || '0'}
            onNext={() => setCurrentStep('signing')}
            onBack={() => setCurrentStep('aml')}
            onSwapRequired={() => {
              // In a real app, this would trigger the SWAP process
              console.log('SWAP required');
            }}
          />
        );
      
      case 'signing':
        return (
          <TransactionSigning
            amount={paymentData?.amount || '0'}
            onSuccess={(txHash) => {
              setTransactionHash(txHash);
              setCurrentStep('settlement');
            }}
            onFailure={() => {
              // Handle failed transaction
              console.log('Transaction failed');
            }}
            onBack={() => setCurrentStep('balance')}
          />
        );
      
      case 'settlement':
        return (
          <SettlementNotification
            amount={paymentData?.amount || '0'}
            transactionHash={transactionHash}
            onComplete={() => setCurrentStep('complete')}
          />
        );
      
      case 'complete':
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-success">Payment Complete!</h2>
            <p className="text-muted-foreground">Your transaction has been processed successfully.</p>
            <Button onClick={() => setCurrentStep('initiation')}>Start New Payment</Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Header */}
        <Card className="glass-elevated">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                CBDeFi Payment Gateway
              </h1>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>
            
            <Progress value={progress} className="w-full h-2" />
            
            {/* Step Carousel */}
            <StepCarousel steps={steps} currentStepIndex={currentStepIndex} />
          </div>
        </Card>

        {/* Current Step Content */}
        <div className="transition-all duration-500">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}