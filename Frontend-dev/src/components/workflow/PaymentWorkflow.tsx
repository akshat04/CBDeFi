import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type WorkflowStep = 'wallet' | 'initiation' | 'kyc' | 'validation' | 'preparation' | 'balance' | 'signing' | 'settlement' | 'complete';

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  inrValue: number;
  icon: string;
}

export function PaymentWorkflow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('wallet');
  const [paymentData, setPaymentData] = useState<{
    amount: string;
    method: 'qr' | 'manual';
    phoneNumber: string;
    selectedToken: Token;
    description?: string;
  } | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const steps = [
    { id: 'wallet', label: 'Wallet Connection', description: 'Connect & verify wallet' },
    { id: 'initiation', label: 'Payment Initiation', description: 'Enter amount & method' },
    { id: 'kyc', label: 'KYC Check', description: 'Verification requirement' },
    { id: 'validation', label: 'Token Validation', description: 'Verify & validate' },
    { id: 'preparation', label: 'Transaction Review', description: 'Review & confirm' },
    { id: 'signing', label: 'Transaction Signing', description: 'Sign & complete' },
    { id: 'settlement', label: 'Settlement', description: 'Process payment' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'wallet':
        return (
          <WalletConnection
            onNext={() => setCurrentStep('initiation')}
            onBlacklisted={() => {
              // Reset to wallet connection for blacklisted users
              setCurrentStep('wallet');
            }}
          />
        );
      
      case 'initiation':
        return (
          <PaymentInitiation
            onNext={(data) => {
              setPaymentData(data);
              setSelectedToken(data.selectedToken);
              const amount = parseFloat(data.amount.replace(/[^\d.]/g, ''));
              
              // If wINR is selected, skip validation and go to preparation
              if (data.selectedToken.symbol === 'wINR') {
                setCurrentStep(amount >= 10000 ? 'kyc' : 'preparation');
              } else {
                setCurrentStep(amount >= 10000 ? 'kyc' : 'validation');
              }
            }}
          />
        );
      
      case 'kyc':
        return (
          <KYCRequirement
            amount={paymentData?.amount || '0'}
            onNext={() => {
              // After KYC, check if wINR was selected to decide next step
              if (selectedToken?.symbol === 'wINR') {
                setCurrentStep('preparation');
              } else {
                setCurrentStep('validation');
              }
            }}
            onBack={() => setCurrentStep('initiation')}
          />
        );
      
      case 'validation':
        return (
          <TokenValidation
            token={selectedToken!}
            amount={paymentData?.amount || '0'}
            onNext={() => setCurrentStep('preparation')}
            onBack={() => {
              const amount = parseFloat(paymentData?.amount.replace(/[^\d.]/g, '') || '0');
              setCurrentStep(amount >= 10000 ? 'kyc' : 'initiation');
            }}
            onSwap={() => {
              // In a real app, this would trigger the SWAP process
              // For demo, we'll just proceed
              setCurrentStep('preparation');
            }}
            onConfirmPayment={() => setCurrentStep('preparation')}
            onCancelPayment={() => setCurrentStep('initiation')}
          />
        );
      
      case 'preparation':
        return (
          <TransactionPreparation
            amount={paymentData?.amount || '0'}
            selectedToken={selectedToken || undefined}
            onProceed={() => {
              if (selectedToken?.symbol === 'wINR') {
                // For wINR, skip signing and go directly to settlement
                setTransactionHash('0x' + Math.random().toString(16).slice(2, 18));
                setCurrentStep('settlement');
              } else {
                setCurrentStep('signing');
              }
            }}
            onCancel={() => setCurrentStep('initiation')}
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
            onBack={() => setCurrentStep('preparation')}
          />
        );
      
      case 'settlement':
        return (
          <SettlementNotification
            amount={paymentData?.amount || '0'}
            transactionHash={transactionHash}
            onClose={() => navigate('/')}
            onMakeAnotherPayment={() => setCurrentStep('initiation')}
          />
        );
      
      case 'complete':
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-success">Payment Complete!</h2>
            <p className="text-muted-foreground">Your transaction has been processed successfully.</p>
            <Button onClick={() => setCurrentStep('wallet')}>Start New Payment</Button>
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
        <Card className="glass-neon interactive-card">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold text-cyber text-glow">
                CBDeFi Payment Gateway
              </h1>
            </div>
            
            <div className="relative">
              <Progress value={progress} className="w-full h-3 neon-glow" />
              <div className="absolute inset-0 bg-gradient-neon opacity-20 rounded-full blur-sm"></div>
            </div>
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