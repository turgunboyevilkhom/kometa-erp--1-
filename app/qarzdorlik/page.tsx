"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"

const debts = [
  {
    id: 1,
    supplier: "Coca-Cola Uzbekistan",
    totalPurchase: 25000000,
    totalPaid: 15000000,
    remaining: 10000000,
    status: "Qarzdor",
    lastPayment: "2025-01-10",
    paymentHistory: [
      { date: "2025-01-10", amount: 5000000 },
      { date: "2024-12-20", amount: 10000000 },
    ],
  },
  {
    id: 2,
    supplier: "Elma Chips",
    totalPurchase: 5000000,
    totalPaid: 5000000,
    remaining: 0,
    status: "To'langan",
    lastPayment: "2025-01-05",
    paymentHistory: [{ date: "2025-01-05", amount: 5000000 }],
  },
  {
    id: 3,
    supplier: "Pepsi Co",
    totalPurchase: 18000000,
    totalPaid: 12000000,
    remaining: 6000000,
    status: "Qarzdor",
    lastPayment: "2025-01-12",
    paymentHistory: [
      { date: "2025-01-12", amount: 4000000 },
      { date: "2024-12-28", amount: 8000000 },
    ],
  },
  {
    id: 4,
    supplier: "Nestle Uzbekistan",
    totalPurchase: 12000000,
    totalPaid: 8000000,
    remaining: 4000000,
    status: "Qarzdor",
    lastPayment: "2025-01-08",
    paymentHistory: [
      { date: "2025-01-08", amount: 3000000 },
      { date: "2024-12-15", amount: 5000000 },
    ],
  },
  {
    id: 5,
    supplier: "Unilever",
    totalPurchase: 8500000,
    totalPaid: 8500000,
    remaining: 0,
    status: "To'langan",
    lastPayment: "2025-01-11",
    paymentHistory: [{ date: "2025-01-11", amount: 8500000 }],
  },
]

export default function DebtsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDebt, setSelectedDebt] = useState<(typeof debts)[0] | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")

  const filteredDebts = debts.filter((debt) => debt.supplier.toLowerCase().includes(searchQuery.toLowerCase()))

  const totalDebt = filteredDebts.reduce((sum, debt) => sum + debt.remaining, 0)
  const totalPurchase = filteredDebts.reduce((sum, debt) => sum + debt.totalPurchase, 0)
  const totalPaid = filteredDebts.reduce((sum, debt) => sum + debt.totalPaid, 0)
  const debtorsCount = filteredDebts.filter((d) => d.remaining > 0).length

  const handlePayment = () => {
    console.log("Payment processed:", paymentAmount)
    setIsPaymentDialogOpen(false)
    setPaymentAmount("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Qarzdorlik</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Umumiy qarz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{totalDebt.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">UZS</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Jami xarid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{totalPurchase.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">UZS</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              To'langan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">UZS</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Qarzdorlar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{debtorsCount}</p>
            <p className="text-xs text-slate-500 mt-1">ta yetkazuvchi</p>
          </CardContent>
        </Card>
      </div>

      {/* Debts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Yetkazuvchilar qarzdorligi</CardTitle>
            <div className="w-64">
              <Input
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Yetkazuvchi</TableHead>
                  <TableHead className="text-right">Jami xarid</TableHead>
                  <TableHead className="text-right">To'langan</TableHead>
                  <TableHead className="text-right">Qolgan</TableHead>
                  <TableHead>Oxirgi to'lov</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell className="font-medium">{debt.supplier}</TableCell>
                    <TableCell className="text-right">{debt.totalPurchase.toLocaleString()} UZS</TableCell>
                    <TableCell className="text-right">{debt.totalPaid.toLocaleString()} UZS</TableCell>
                    <TableCell className="text-right font-bold">{debt.remaining.toLocaleString()} UZS</TableCell>
                    <TableCell>{debt.lastPayment}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          debt.status === "To'langan"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700 border-0"
                        }
                      >
                        {debt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              Tarix
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{debt.supplier} - To'lov tarixi</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              {debt.paymentHistory.map((payment, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <span className="text-sm text-slate-600">{payment.date}</span>
                                  <span className="font-semibold text-green-600">
                                    +{payment.amount.toLocaleString()} UZS
                                  </span>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {debt.remaining > 0 && (
                          <Button
                            size="sm"
                            style={{ backgroundColor: "#004B34" }}
                            className="text-white"
                            onClick={() => {
                              setSelectedDebt(debt)
                              setIsPaymentDialogOpen(true)
                            }}
                          >
                            To'lov
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>To'lov qilish</DialogTitle>
          </DialogHeader>
          {selectedDebt && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Yetkazuvchi</p>
                <p className="font-semibold text-lg">{selectedDebt.supplier}</p>
                <p className="text-sm text-slate-600 mt-2">Qarz miqdori</p>
                <p className="font-bold text-xl text-red-600">{selectedDebt.remaining.toLocaleString()} UZS</p>
              </div>
              <div className="space-y-2">
                <Label>To'lov miqdori</Label>
                <Input
                  type="number"
                  placeholder="Miqdorni kiriting"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button style={{ backgroundColor: "#004B34" }} className="text-white" onClick={handlePayment}>
                  To'lov qilish
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
