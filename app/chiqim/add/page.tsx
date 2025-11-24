"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X, Scan, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockProducts = [
  { barcode: "4870251005780", name: "Coca-Cola 0.5L", price: 18000 },
  { barcode: "4870251005797", name: "Fanta Orange 1L", price: 25000 },
  { barcode: "4870251005803", name: "Lays Chips Original 150g", price: 12500 },
  { barcode: "4870251005810", name: "KitKat Chocolate 45g", price: 14000 },
  { barcode: "4870251005827", name: "Nescafe Classic 50g", price: 20000 },
  { barcode: "4870251005834", name: "Sprite 1L", price: 22000 },
  { barcode: "4870251005841", name: "Pepsi 1.5L", price: 28000 },
]

const warehouses = [
  { id: 1, name: "Asosiy ombor" },
  { id: 2, name: "Filial ombor" },
  { id: 3, name: "Ulgurji ombor" },
]

const writeOffReasons = [
  { id: "expired", name: "Yaroqlilik muddati o'tgan" },
  { id: "damaged", name: "Shikastlangan qadoq" },
  { id: "quality", name: "Sifat standartlariga mos kelmaydi" },
  { id: "broken", name: "Singan yoki buzilgan" },
  { id: "other", name: "Boshqa sabab" },
]

export default function AddWriteOffPage() {
  const router = useRouter()
  const scannerInputRef = useRef<HTMLInputElement>(null)

  const [writeOffData, setWriteOffData] = useState({
    warehouse: "",
    reason: "",
    docNumber: "",
    notes: "",
  })

  const [products, setProducts] = useState<
    Array<{ barcode: string; name: string; quantity: number; price: number; total: number }>
  >([])
  const [barcodeInput, setBarcodeInput] = useState("")

  const handleScannerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const barcode = barcodeInput.trim()
      if (barcode) {
        const product = mockProducts.find((p) => p.barcode === barcode)
        if (product) {
          const existingIndex = products.findIndex((p) => p.barcode === barcode)
          if (existingIndex >= 0) {
            const updatedProducts = [...products]
            updatedProducts[existingIndex].quantity += 1
            updatedProducts[existingIndex].total = updatedProducts[existingIndex].quantity * product.price
            setProducts(updatedProducts)
          } else {
            setProducts([
              ...products,
              {
                barcode: product.barcode,
                name: product.name,
                quantity: 1,
                price: product.price,
                total: product.price,
              },
            ])
          }
          setBarcodeInput("")
        } else {
          alert("Mahsulot topilmadi!")
        }
      }
    }
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedProducts = [...products]
    updatedProducts[index].quantity = quantity
    updatedProducts[index].total = quantity * updatedProducts[index].price
    setProducts(updatedProducts)
  }

  const handlePriceChange = (index: number, price: number) => {
    const updatedProducts = [...products]
    updatedProducts[index].price = price
    updatedProducts[index].total = price * updatedProducts[index].quantity
    setProducts(updatedProducts)
  }

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!writeOffData.warehouse || !writeOffData.reason || products.length === 0) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!")
      return
    }
    alert("Hisobdan chiqarish saqlandi!")
    router.push("/chiqim")
  }

  const totalAmount = products.reduce((sum, p) => sum + p.total, 0)
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/chiqim">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yangi hisobdan chiqarish hujjati</h1>
          <p className="text-sm text-muted-foreground">Tovarlarni ombor hisobidan chiqarish</p>
        </div>
      </div>

      {/* Document Information */}
      <Card>
        <CardHeader>
          <CardTitle>Hujjat ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>
                Ombor <span className="text-red-500">*</span>
              </Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={writeOffData.warehouse}
                onChange={(e) => setWriteOffData({ ...writeOffData, warehouse: e.target.value })}
              >
                <option value="">Tanlang</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>
                Sabab <span className="text-red-500">*</span>
              </Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={writeOffData.reason}
                onChange={(e) => setWriteOffData({ ...writeOffData, reason: e.target.value })}
              >
                <option value="">Tanlang</option>
                {writeOffReasons.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Hujjat raqami</Label>
              <Input
                placeholder="CHQ-001"
                value={writeOffData.docNumber}
                onChange={(e) => setWriteOffData({ ...writeOffData, docNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Izoh</Label>
            <Input
              placeholder="Qo'shimcha ma'lumot..."
              value={writeOffData.notes}
              onChange={(e) => setWriteOffData({ ...writeOffData, notes: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Scanner Input */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                ref={scannerInputRef}
                placeholder="Shtrix-kodni skanerlang yoki kiriting..."
                className="pl-10 h-12 text-base"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleScannerInput}
              />
            </div>
            <Button size="lg" variant="outline" className="h-12 px-6 bg-transparent">
              <Scan className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mahsulotlar ro'yxati</CardTitle>
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                Jami: <strong>{totalQuantity} dona</strong>
              </span>
              <span className="text-muted-foreground">
                Summa: <strong className="text-red-600">{totalAmount.toLocaleString()} so'm</strong>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Mahsulot qo'shilmagan</p>
              <p className="text-sm">Yuqoridagi skanerdan foydalaning</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Mahsulot nomi</TableHead>
                  <TableHead>Shtrix-kod</TableHead>
                  <TableHead className="w-32">Miqdor</TableHead>
                  <TableHead className="w-40">Narx</TableHead>
                  <TableHead className="text-right">Jami</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-sm text-slate-600">{product.barcode}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(index, Number.parseInt(e.target.value) || 1)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={product.price}
                        onChange={(e) => handlePriceChange(index, Number.parseInt(e.target.value) || 0)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="text-right font-semibold">{product.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => handleRemoveProduct(index)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {products.length > 0 && (
        <Card className="border-2" style={{ borderColor: "#004B34" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jami mahsulotlar</p>
                <p className="text-2xl font-bold">{totalQuantity} dona</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Umumiy summa</p>
                <p className="text-3xl font-bold text-red-600">{totalAmount.toLocaleString()} so'm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="lg" onClick={() => router.push("/chiqim")}>
          Bekor qilish
        </Button>
        <Button
          size="lg"
          style={{ backgroundColor: "#004B34" }}
          className="text-white px-8"
          onClick={handleSave}
          disabled={!writeOffData.warehouse || !writeOffData.reason || products.length === 0}
        >
          Saqlash
        </Button>
      </div>
    </div>
  )
}
