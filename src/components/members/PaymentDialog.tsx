import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaymentMethodSelector from "./payment/PaymentMethodSelector";
import PaymentTypeSelector from "./payment/PaymentTypeSelector";
import BankDetails from "./payment/BankDetails";
import { useState } from "react";
import { Collector } from "@/types/collector";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank_transfer' | 'cash'>('bank_transfer');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!collectorInfo?.id) {
      toast({
        title: "Error",
        description: "No collector information available",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          member_id: memberId,
          member_number: memberNumber,
          payment_type: selectedPaymentType,
          payment_method: selectedPaymentMethod,
          status: 'pending',
          collector_id: collectorInfo.id,
          amount: selectedPaymentType === 'yearly' ? 40 : 20
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment request submitted successfully",
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['member-payments'] });
      
      onClose();
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit payment request",
        variant: "destructive"
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