import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { DollarSign, ArrowDown, ArrowUp } from "lucide-react"

function GradientCard({ title, value, icon: Icon, gradient }: { title: string, value: string, icon: React.ElementType, gradient: string }) {
    return (
        <Card className={`relative overflow-hidden text-white ${gradient}`}>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-5 w-5" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export function FinanceSummary({ transactions }: { transactions: Transaction[] }) {
    const revenue = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = revenue - expenses;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <GradientCard 
                title="Total Revenue"
                value={formatCurrency(revenue)}
                icon={ArrowUp}
                gradient="bg-gradient-to-br from-green-500 to-green-700"
            />
             <GradientCard 
                title="Total Expenses"
                value={formatCurrency(expenses)}
                icon={ArrowDown}
                gradient="bg-gradient-to-br from-red-500 to-red-700"
            />
             <GradientCard 
                title="Net Profit"
                value={formatCurrency(profit)}
                icon={DollarSign}
                gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            />
        </div>
    )
}
