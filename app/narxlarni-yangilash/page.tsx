"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const products = [
  {
    id: 1,
    name: "Coca-Cola 0.5L",
    purchasePrice: 5500,
    salePrice: 6908,
    newPrice: 6908,
    priceList: "Narx ro'yxati 01",
    date: "2024-12-15",
  },
  {
    id: 2,
    name: "Lays Chips Original 150g",
    purchasePrice: 8200,
    salePrice: 10250,
    newPrice: 10250,
    priceList: "Narx ro'yxati 01",
    date: "2024-12-10",
  },
  {
    id: 3,
    name: "Fanta Orange 1L",
    purchasePrice: 18000,
    salePrice: 22500,
    newPrice: 22500,
    priceList: "Narx ro'yxati 02",
    date: "2024-12-05",
  },
]

export default function PriceUpdatePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [prices, setPrices] = useState(products)

  const updatePrice = (id: number, newPrice: number) => {
    setPrices(prices.map((p) => (p.id === id ? { ...p, newPrice } : p)))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Narxlarni yangilash</h1>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Mahsulot qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Narx ro'yxati" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="list1">Narx ro'yxati 01</SelectItem>
                <SelectItem value="list2">Narx ro'yxati 02</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Price Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mahsulotlar narxlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahsulot nomi</TableHead>
                  <TableHead className="text-right">Xarid narxi</TableHead>
                  <TableHead className="text-right">Sotish narxi</TableHead>
                  <TableHead className="text-right">Yangi narx</TableHead>
                  <TableHead>Narx ro'yxati</TableHead>
                  <TableHead>Sana</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.purchasePrice.toLocaleString()} UZS</TableCell>
                    <TableCell className="text-right">{product.salePrice.toLocaleString()} UZS</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={product.newPrice}
                        onChange={(e) => updatePrice(product.id, Number(e.target.value))}
                        className="w-32 text-right"
                      />
                    </TableCell>
                    <TableCell>{product.priceList}</TableCell>
                    <TableCell>{product.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline">Bekor qilish</Button>
            <Button
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              }}
              className="text-white"
            >
              Saqlash
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
