import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Payment {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
}

const PaymentHistoryTable = () => {
  // This would typically come from an API/database
  const payments: Payment[] = [
    {
      id: "1",
      date: "2024-01-01",
      type: "Annual Payment",
      amount: 40,
      status: "Completed",
    },
    {
      id: "2",
      date: "2024-01-01",
      type: "Emergency Collection",
      amount: 100,
      status: "Completed",
    },
  ];

  return (
    <div className="glass-card p-4">
      <h3 className="text-xl font-semibold mb-4 text-white">Payment History</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.date), 'PPP')}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>£{payment.amount}</TableCell>
                <TableCell>{payment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;