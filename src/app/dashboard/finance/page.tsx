import { FinanceSummary } from "@/components/finance/finance-summary";
import { TransactionTable } from "@/components/finance/transaction-table";
import { transactions } from "@/lib/data";

export default function FinancePage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">
          Track your revenue, expenses, and profit.
        </p>
      </div>
      <FinanceSummary transactions={transactions} />
      <TransactionTable transactions={transactions} />
    </div>
  );
}
