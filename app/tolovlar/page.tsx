"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/pagination"

const payments = Array.from({ length: 38 }, (_, i) => ({
  id: i + 1,
  supplier: ["Coca-Cola Uzbekistan", "Elma Chips", "Pepsi Co", "Mars Inc.", "Nestle"][i % 5],
  amount: Math.floor(Math.random() * 20000000) + 500000,
  date: `2025-01-${Math.floor(Math.random() * 28) + 1}`,
  method: i % 2 === 0 ? "Naqd" : "Bank",
}))

export default function PaymentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const totalPages = Math.ceil(payments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPayments = payments.slice(startIndex, endIndex)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Yetkazib beruvchilarga to'lovlar</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#004B34] hover:bg-[#003826] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Yangi to'lov
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Boshlang'ich sana</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tugash sanasi</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>To'lovlar ro'yxati</CardTitle>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
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
            {currentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{payment.supplier}</p>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    className={
                      payment.method === "Naqd" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                    }
                  >
                    {payment.method}
                  </Badge>
                  <p className="text-lg font-bold">{payment.amount.toLocaleString()} UZS</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, payments.length)} dan {payments.length} ta ko'rsatilmoqda
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi to'lov</DialogTitle>
            <DialogDescription>To'lov ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Yetkazib beruvchi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coca">Coca-Cola Uzbekistan</SelectItem>
                  <SelectItem value="elma">Elma Chips</SelectItem>
                  <SelectItem value="pepsi">Pepsi Co</SelectItem>
                  <SelectItem value="mars">Mars Inc.</SelectItem>
                  <SelectItem value="nestle">Nestle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Summa</Label>
              <Input type="number" placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label>To'lov turi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Naqd</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sana</Label>
              <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button className="bg-[#004B34] hover:bg-[#003826] text-white">Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
