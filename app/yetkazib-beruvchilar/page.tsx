"use client"

import { useState } from "react"
import { Plus, Search, Mail, Phone } from "lucide-react"
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

const suppliers = [
  {
    id: 1,
    name: "Coca-Cola Uzbekistan",
    phone: "+998 90 123 45 67",
    email: "info@coca-cola.uz",
    address: "Toshkent, Yunusobod tumani",
    status: "Faol",
    totalOrders: 45,
    totalAmount: 125000000,
  },
  {
    id: 2,
    name: "Elma Chips",
    phone: "+998 91 234 56 78",
    email: "sales@elma.uz",
    address: "Toshkent, Chilonzor tumani",
    status: "Faol",
    totalOrders: 32,
    totalAmount: 58000000,
  },
  {
    id: 3,
    name: "Pepsi Co",
    phone: "+998 93 345 67 89",
    email: "contact@pepsi.uz",
    address: "Toshkent, Sergeli tumani",
    status: "Faol",
    totalOrders: 28,
    totalAmount: 89000000,
  },
]

export default function SuppliersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#004B34]">Yetkazib beruvchilar</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#004B34] hover:bg-[#003822] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Yangi taminotchi qoshish
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Yetkazuvchi qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-[#004B34]">{supplier.name}</CardTitle>
                  <Badge className="mt-2 bg-green-100 text-green-700">{supplier.status}</Badge>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl bg-[#004B34]">
                  {supplier.name.charAt(0)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {supplier.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {supplier.email}
              </div>
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Buyurtmalar:</span>
                  <span className="font-medium">{supplier.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jami summa:</span>
                  <span className="font-medium">{supplier.totalAmount.toLocaleString()} UZS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Supplier Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi yetkazuvchi</DialogTitle>
            <DialogDescription>Yetkazuvchi ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nomi</Label>
              <Input placeholder="Kompaniya nomi" />
            </div>

            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input placeholder="+998 XX XXX XX XX" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@example.com" />
            </div>

            <div className="space-y-2">
              <Label>Manzil</Label>
              <Input placeholder="To'liq manzil" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button className="bg-[#004B34] hover:bg-[#003822] text-white">Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
