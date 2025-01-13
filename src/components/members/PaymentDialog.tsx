import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaymentMethodSelector from "./payment/PaymentMethodSelector";
import PaymentTypeSelector from "./payment/PaymentTypeSelector";
import BankDetails from "./payment/BankDetails";
import { useState } from "react";
import { Collector } from "@/types/collector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberNumber: string;
  memberName: string;
  collectorInfo: Collector | null;
}

const PaymentDialog = ({ 
  isOpen, 
  onClose, 
  memberId,
  memberNumber,
  memberName,
  collectorInfo 
}: PaymentDialogProps) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('yearly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'bank_transfer'>('bank_transfer');
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          member_id: memberId,
          payment_type: selectedPaymentType,
          payment_method: selectedPaymentMethod,
          status: 'pending',
          collector_id: collectorInfo?.id
        });

      if (error) throw error;

      toast({
        title: "Payment Submitted",
        description: "Your payment has been recorded and is pending verification.",
      });

      onClose();
    } catch (error) {
      console.error('Payment submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-dashboard-highlight">
            Make Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <PaymentTypeSelector
            selectedPaymentType={selectedPaymentType}
            onPaymentTypeChange={setSelectedPaymentType}
          />

          <PaymentMethodSelector
            paymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={setSelectedPaymentMethod}
          />

          {selectedPaymentMethod === 'bank_transfer' && (
            <BankDetails memberNumber={memberNumber} />
          )}

          <Button 
            onClick={handleSubmit}
            className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/90"
          >
            Submit Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;