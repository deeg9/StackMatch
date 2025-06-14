"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Budget = {
  id: string
  name: string
  amount: number
  start_date: string
  end_date: string
  spent: number
  remaining: number
}

type Expense = {
  id: string
  budget_id: string
  amount: number
  date: string
  description: string
  category: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

interface BudgetTrackingTabProps {
  buyerProfileId: string
}

const BudgetTrackingTab = ({ buyerProfileId }: BudgetTrackingTabProps) => {
  const { profile } = useSelector((state: RootState) => state.buyerProfile || { profile: null })
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch budgets and expenses or use mock data
    const fetchBudgetData = async () => {
      setLoading(true)
      setError(null)

      try {
        // For demo or if buyerProfileId starts with mock, use mock data
        if (!buyerProfileId || buyerProfileId.startsWith("mock")) {
          // Mock budget data
          const mockBudgets: Budget[] = [
            {
              id: "budget-1",
              name: "Q1 2024 Technology Budget",
              amount: 500000,
              start_date: "2024-01-01",
              end_date: "2024-03-31",
              spent: 350000,
              remaining: 150000,
            },
            {
              id: "budget-2",
              name: "Annual Software Licenses",
              amount: 100000,
              start_date: "2024-01-01",
              end_date: "2024-12-31",
              spent: 75000,
              remaining: 25000,
            },
          ]

          // Mock expense data
          const mockExpenses: Expense[] = [
            {
              id: "expense-1",
              budget_id: "budget-1",
              amount: 150000,
              date: "2024-01-15",
              description: "CRM System Implementation",
              category: "Software",
              status: "APPROVED",
            },
            {
              id: "expense-2",
              budget_id: "budget-1",
              amount: 75000,
              date: "2024-02-10",
              description: "Data Migration Services",
              category: "Services",
              status: "APPROVED",
            },
            {
              id: "expense-3",
              budget_id: "budget-1",
              amount: 125000,
              date: "2024-03-05",
              description: "Custom Development",
              category: "Development",
              status: "PENDING",
            },
            {
              id: "expense-4",
              budget_id: "budget-2",
              amount: 45000,
              date: "2024-01-20",
              description: "Annual SaaS Subscriptions",
              category: "Software",
              status: "APPROVED",
            },
            {
              id: "expense-5",
              budget_id: "budget-2",
              amount: 30000,
              date: "2024-02-15",
              description: "Developer Tools Licenses",
              category: "Software",
              status: "APPROVED",
            },
          ]

          setBudgets(mockBudgets)
          setExpenses(mockExpenses)
          setLoading(false)
          return
        }

        // Try to fetch real data, but use mock data as fallback
        try {
          const budgetsResponse = await fetch(`/api/buyer-profiles/budgets?profileId=${buyerProfileId}`)

          if (!budgetsResponse.ok) {
            throw new Error(`Failed to fetch budgets: ${budgetsResponse.status}`)
          }

          const budgetsData = await budgetsResponse.json()
          setBudgets(budgetsData.budgets || [])

          // Fetch expenses for all budgets
          if (budgetsData.budgets?.length) {
            const expensesResponse = await fetch(`/api/buyer-profiles/expenses?profileId=${buyerProfileId}`)

            if (!expensesResponse.ok) {
              throw new Error(`Failed to fetch expenses: ${expensesResponse.status}`)
            }

            const expensesData = await expensesResponse.json()
            setExpenses(expensesData.expenses || [])
          }
        } catch (error) {
          console.error("Failed to fetch budget data:", error)
          // Fall back to mock data
          const mockBudgets: Budget[] = [
            {
              id: "budget-1",
              name: "Q1 2024 Technology Budget",
              amount: 500000,
              start_date: "2024-01-01",
              end_date: "2024-03-31",
              spent: 350000,
              remaining: 150000,
            },
            {
              id: "budget-2",
              name: "Annual Software Licenses",
              amount: 100000,
              start_date: "2024-01-01",
              end_date: "2024-12-31",
              spent: 75000,
              remaining: 25000,
            },
          ]

          const mockExpenses: Expense[] = [
            {
              id: "expense-1",
              budget_id: "budget-1",
              amount: 150000,
              date: "2024-01-15",
              description: "CRM System Implementation",
              category: "Software",
              status: "APPROVED",
            },
            {
              id: "expense-2",
              budget_id: "budget-1",
              amount: 75000,
              date: "2024-02-10",
              description: "Data Migration Services",
              category: "Services",
              status: "APPROVED",
            },
            {
              id: "expense-3",
              budget_id: "budget-1",
              amount: 125000,
              date: "2024-03-05",
              description: "Custom Development",
              category: "Development",
              status: "PENDING",
            },
            {
              id: "expense-4",
              budget_id: "budget-2",
              amount: 45000,
              date: "2024-01-20",
              description: "Annual SaaS Subscriptions",
              category: "Software",
              status: "APPROVED",
            },
            {
              id: "expense-5",
              budget_id: "budget-2",
              amount: 30000,
              date: "2024-02-15",
              description: "Developer Tools Licenses",
              category: "Software",
              status: "APPROVED",
            },
          ]

          setBudgets(mockBudgets)
          setExpenses(mockExpenses)
        }
      } catch (error) {
        console.error("Error in budget data handling:", error)
        setError("Failed to load budget data. Using demo data instead.")

        // Ensure we have mock data even if everything fails
        setBudgets([
          {
            id: "budget-1",
            name: "Q1 2024 Technology Budget",
            amount: 500000,
            start_date: "2024-01-01",
            end_date: "2024-03-31",
            spent: 350000,
            remaining: 150000,
          },
          {
            id: "budget-2",
            name: "Annual Software Licenses",
            amount: 100000,
            start_date: "2024-01-01",
            end_date: "2024-12-31",
            spent: 75000,
            remaining: 25000,
          },
        ])

        setExpenses([
          {
            id: "expense-1",
            budget_id: "budget-1",
            amount: 150000,
            date: "2024-01-15",
            description: "CRM System Implementation",
            category: "Software",
            status: "APPROVED",
          },
          {
            id: "expense-2",
            budget_id: "budget-1",
            amount: 75000,
            date: "2024-02-10",
            description: "Data Migration Services",
            category: "Services",
            status: "APPROVED",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBudgetData()
  }, [buyerProfileId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateProgress = (spent: number, total: number) => {
    const percentage = (spent / total) * 100
    return {
      percentage: Math.min(percentage, 100),
      color: percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-yellow-500" : "bg-green-500",
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Budget Tracking</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Budget Tracking</h2>
        <div className="space-x-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Budget
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}

      {/* Budgets Section */}
      <div>
        <h3 className="text-lg font-medium mb-3">Active Budgets</h3>

        {budgets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No budgets found. Create your first budget!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget) => {
              const { percentage, color } = calculateProgress(budget.spent, budget.amount)

              return (
                <Card key={budget.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{budget.name}</h4>
                      <span className="font-medium">${budget.amount.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(budget.start_date).toLocaleDateString()} -
                        {new Date(budget.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          ${budget.spent.toLocaleString()} of ${budget.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{percentage.toFixed(0)}% used</span>
                        <span>${budget.remaining.toLocaleString()} remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Expenses Section */}
      <div>
        <h3 className="text-lg font-medium mb-3">Recent Expenses</h3>

        {expenses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No expenses found. Add your first expense!</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>${expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default BudgetTrackingTab
