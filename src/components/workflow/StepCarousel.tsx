import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepCarouselProps {
  steps: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  currentStepIndex: number;
}

export function StepCarousel({ steps, currentStepIndex }: StepCarouselProps) {
  const [displayIndex, setDisplayIndex] = useState(Math.max(0, currentStepIndex));

  useEffect(() => {
    setDisplayIndex(Math.max(0, currentStepIndex));
  }, [currentStepIndex]);

  // Add bounds checking to prevent undefined errors
  const safeDisplayIndex = Math.max(0, Math.min(displayIndex, steps.length - 1));
  const currentStep = steps[safeDisplayIndex];
  const canGoBack = safeDisplayIndex > 0;
  const canGoForward = safeDisplayIndex < Math.max(0, currentStepIndex);

  // Early return if no steps or current step is undefined
  if (!steps.length || !currentStep) {
    return null;
  }

  const handlePrevious = () => {
    if (canGoBack) {
      setDisplayIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setDisplayIndex(prev => prev + 1);
    }
  };

  return (
    <div className="relative">
      {/* Step Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevious}
          disabled={!canGoBack}
          className={`p-2 rounded-full transition-all duration-200 ${
            canGoBack 
              ? 'text-primary hover:bg-primary/10 hover:scale-110' 
              : 'text-muted-foreground/50 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 mx-4">
          <div className="relative overflow-hidden">
            <Card 
              key={displayIndex}
              className="glass-elevated animate-fade-in"
            >
              <div className="p-6 text-center">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Badge 
                    variant={displayIndex <= currentStepIndex ? "default" : "secondary"}
                    className={`${
                      displayIndex <= currentStepIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    Step {displayIndex + 1}
                  </Badge>
                  {displayIndex === currentStepIndex && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                      Current
                    </Badge>
                  )}
                  {displayIndex < currentStepIndex && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      Completed
                    </Badge>
                  )}
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                  displayIndex <= currentStepIndex 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                }`}>
                  {currentStep.label}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  {currentStep.description}
                </p>
              </div>
            </Card>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoForward}
          className={`p-2 rounded-full transition-all duration-200 ${
            canGoForward 
              ? 'text-primary hover:bg-primary/10 hover:scale-110' 
              : 'text-muted-foreground/50 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setDisplayIndex(index)}
            disabled={index > currentStepIndex}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === displayIndex
                ? 'bg-primary scale-125'
                : index <= currentStepIndex
                ? 'bg-primary/60 hover:bg-primary/80'
                : 'bg-muted-foreground/30 cursor-not-allowed'
            }`}
          />
        ))}
      </div>
    </div>
  );
}