"use client"

import { useState } from "react"
import { Package, TrendingUp, AlertTriangle, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const inventoryData = [
  {
    id: 1,
    name: "Coca-Cola 0.5L",
    category: "Ichimliklar",
    barcode: "4870251005766",
    quantity: 36,
    unit: "dona",
    price: "18,000",
    status: "Yetarli",
    stockLevel: 75,
  },
  {
    id: 2,
    name: "Lays Chips Original 150g",
    category: "Chipsi",
    barcode: "4870251005773",
    quantity: 12,
    unit: "dona",
    price: "12,500",
    status: "O'rtacha",
    stockLevel: 40,
  },
  {
    id: 3,
    name: "Fanta Orange 1L",
    category: "Ichimliklar",
    barcode: "4870251005780",
    quantity: 5,
    unit: "dona",
    price: "25,000",
    status: "Kam",
    stockLevel: 15,
  },
]

const statusColors = {
  Yetarli: "bg-green-100 text-green-700",
  "O'rtacha": "bg-amber-100 text-amber-700",
  Kam: "bg-red-100 text-red-700",
}

export default function WarehousePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  const totalProducts = inventoryData.length
  const totalValue = inventoryData.reduce((sum, item) => {
    return sum + Number.parseInt(item.price.replace(/,/g, "")) * item.quantity
  }, 0)
  const lowStockCount = inventoryData.filter((item) => item.status === "Kam").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#004B34]">Ombor qoldiqlari</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setIsAddProductOpen(true)} className="bg-[#004B34] hover:bg-[#003822] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Yangi tovar qoshish
          </Button>

          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Ombor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Asosiy ombor</SelectItem>
              <SelectItem value="branch">Filial ombor</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kategoriya" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="drinks">Ichimliklar</SelectItem>
              <SelectItem value="chips">Chipsi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jami mahsulotlar</CardTitle>
            <Package className="h-5 w-5 text-[#004B34]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#004B34]">{totalProducts}</div>
            <p className="text-xs text-[#99C61E] mt-1">+8.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Umumiy qiymat</CardTitle>
            <TrendingUp className="h-5 w-5 text-[#004B34]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#004B34]">{totalValue.toLocaleString()} so'm</div>
            <p className="text-xs text-[#99C61E] mt-1">+15.3%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kam qolgan mahsulotlar</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-red-600 mt-1">E'tibor talab qiladi</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mahsulotlar ro'yxati</CardTitle>
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
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahsulot</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Shtrix-kod</TableHead>
                  <TableHead>Miqdori</TableHead>
                  <TableHead className="text-right">Narx</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold bg-[#004B34]">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="font-mono text-sm">{item.barcode}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {item.quantity} {item.unit}
                        </div>
                        <Progress value={item.stockLevel} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.price} <span className="text-muted-foreground">UZS</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status as keyof typeof statusColors]}>{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yangi tovar qoshish</DialogTitle>
            <DialogDescription>Yangi mahsulot ma'lumotlarini kiriting va saqlash tugmasini bosing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nomi
              </Label>
              <Input id="name" placeholder="Masalan: Coca-Cola" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategoriya
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drinks">Ichimliklar</SelectItem>
                  <SelectItem value="food">Oziq-ovqat</SelectItem>
                  <SelectItem value="household">Xo'jalik mollari</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barcode" className="text-right">
                Shtrix-kod
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input id="barcode" placeholder="Skanerlang..." />
                <Button size="icon" variant="outline" type="button">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Narxi
              </Label>
              <Input id="price" type="number" placeholder="0" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Miqdori
              </Label>
              <Input id="quantity" type="number" placeholder="0" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" className="bg-[#004B34] hover:bg-[#003822] text-white">
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
