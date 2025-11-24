"use client"

import { useState } from "react"
import { DollarSign, Download, Search, Filter, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/pagination"

const transactions = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? "income" : "expense",
  description: i % 3 === 0 ? "Sotuvdan tushum" : i % 2 === 0 ? "Yetkazuvchiga to'lov" : "Kommunal to'lovlar",
  amount: Math.floor(Math.random() * 8000000) + 200000,
  date: `2025-01-${Math.floor(Math.random() * 28) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  method: i % 2 === 0 ? "Naqd" : "Bank",
}))

export default function CashRegisterPage() {
  const [activeTab, setActiveTab] = useState("today")
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setShowCustomRange(value === "custom")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Kassa</h1>
        <div className="flex items-center gap-3">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="today">Bugun</TabsTrigger>
              <TabsTrigger value="week">Hafta</TabsTrigger>
              <TabsTrigger value="month">Oy</TabsTrigger>
              <TabsTrigger value="custom">Boshqa</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Yuklab olish
          </Button>
        </div>
      </div>

      {/* Custom Date Range */}
      {showCustomRange && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Boshlang'ich sana</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Tugash sanasi</Label>
                <Input type="date" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jami kirim</CardTitle>
            <ArrowUpCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString()} UZS</div>
            <p className="text-xs text-green-600 mt-1">+12.5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jami chiqim</CardTitle>
            <ArrowDownCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExpense.toLocaleString()} UZS</div>
            <p className="text-xs text-red-600 mt-1">+8.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balans</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{balance.toLocaleString()} UZS</div>
            <p className="text-xs text-green-600 mt-1">+4.3%</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tranzaksiyalar</CardTitle>
            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filtrlash" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="income">Kirim</SelectItem>
                  <SelectItem value="expense">Chiqim</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Saralash
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-5 w-5" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={transaction.method === "Naqd" ? "default" : "secondary"}
                    className={
                      transaction.method === "Naqd" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }
                  >
                    {transaction.method}
                  </Badge>
                  <p
                    className={`text-lg font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount.toLocaleString()} UZS
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, transactions.length)} dan {transactions.length} ta ko'rsatilmoqda
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
