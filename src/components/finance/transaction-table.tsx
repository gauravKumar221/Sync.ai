import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Transaction } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A list of your recent income and expenses.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            transaction.type === 'Income' 
                                            ? 'text-green-400 border-green-400/50' 
                                            : 'text-red-400 border-red-400/50'
                                        )}>
                                            {transaction.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell className={cn("text-right font-mono", transaction.type === 'Income' ? 'text-green-400' : 'text-red-400')}>
                                        {transaction.type === 'Income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
