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

const expenses = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  description: `${["Elektr energiya to'lovi", "Xodimlar oyligi", "Ofis ijarasi", "Internet xizmati", "Telefon to'lovi"][i % 5]}`,
  amount: Math.floor(Math.random() * 10000000) + 100000,
  date: new Date(2025, 0, Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
  category: ["Kommunal", "Ish haqi", "Ijara", "Boshqa"][i % 4],
}))

const categoryColors = {
  Kommunal: "bg-blue-100 text-blue-700",
  "Ish haqi": "bg-purple-100 text-purple-700",
  Ijara: "bg-orange-100 text-orange-700",
  Boshqa: "bg-slate-100 text-slate-700",
}

export default function ExpensesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const totalPages = Math.ceil(expenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentExpenses = expenses.slice(startIndex, endIndex)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Harajatlar</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#004B34] hover:bg-[#003826] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Yangi harajat
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

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Harajatlar ro'yxati</CardTitle>
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
            {currentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">{expense.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={categoryColors[expense.category as keyof typeof categoryColors]}>
                    {expense.category}
                  </Badge>
                  <p className="text-lg font-bold">{expense.amount.toLocaleString()} UZS</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, expenses.length)} dan {expenses.length} ta ko'rsatilmoqda
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi harajat</DialogTitle>
            <DialogDescription>Harajat ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tavsif</Label>
              <Input placeholder="Harajat tavsifi" />
            </div>

            <div className="space-y-2">
              <Label>Summa</Label>
              <Input type="number" placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label>Kategoriya</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utilities">Kommunal</SelectItem>
                  <SelectItem value="salary">Ish haqi</SelectItem>
                  <SelectItem value="rent">Ijara</SelectItem>
                  <SelectItem value="other">Boshqa</SelectItem>
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
