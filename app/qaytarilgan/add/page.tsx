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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockProducts = [
  { barcode: "4870251005780", name: "Coca-Cola 0.5L", price: 18000, purchasePrice: 15000 },
  { barcode: "4870251005797", name: "Fanta Orange 1L", price: 25000, purchasePrice: 20000 },
  { barcode: "4870251005803", name: "Lays Chips Original 150g", price: 12500, purchasePrice: 10000 },
  { barcode: "4870251005810", name: "KitKat Chocolate 45g", price: 14000, purchasePrice: 11000 },
  { barcode: "4870251005827", name: "Nescafe Classic 50g", price: 20000, purchasePrice: 16000 },
  { barcode: "4870251005834", name: "Sprite 1L", price: 22000, purchasePrice: 18000 },
  { barcode: "4870251005841", name: "Pepsi 1.5L", price: 28000, purchasePrice: 23000 },
]

const mockSuppliers = [
  { id: 1, name: "Coca-Cola Uzbekistan", phone: "+998 90 123 45 67" },
  { id: 2, name: "Elma Chips", phone: "+998 91 234 56 78" },
  { id: 3, name: "Nestle Uzbekistan", phone: "+998 93 345 67 89" },
  { id: 4, name: "Pepsi Co", phone: "+998 94 456 78 90" },
]

const priceListOptions = [
  { id: "purchase", name: "Xarid narxi", key: "purchasePrice" },
  { id: "retail", name: "Chakana narx", key: "price" },
]

export default function AddReturnPage() {
  const router = useRouter()
  const scannerInputRef = useRef<HTMLInputElement>(null)

  const [returnData, setReturnData] = useState({
    supplier: "",
    phone: "",
    reason: "",
    purchaseNumber: "",
    priceList: "purchase",
  })

  const [products, setProducts] = useState<
    Array<{ barcode: string; name: string; quantity: number; price: number; total: number }>
  >([])
  const [barcodeInput, setBarcodeInput] = useState("")
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ barcode: "", name: "", unit: "dona" })

  const handleScannerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const barcode = barcodeInput.trim()
      if (barcode) {
        const product = mockProducts.find((p) => p.barcode === barcode)
        if (product) {
          const selectedPriceList = priceListOptions.find((pl) => pl.id === returnData.priceList)
          const priceKey = selectedPriceList?.key || "purchasePrice"
          const price = product[priceKey as keyof typeof product] as number

          const existingIndex = products.findIndex((p) => p.barcode === barcode)
          if (existingIndex >= 0) {
            const updatedProducts = [...products]
            updatedProducts[existingIndex].quantity += 1
            updatedProducts[existingIndex].total = updatedProducts[existingIndex].quantity * price
            setProducts(updatedProducts)
          } else {
            setProducts([
              ...products,
              {
                barcode: product.barcode,
                name: product.name,
                quantity: 1,
                price,
                total: price,
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

  const handleCreateProduct = () => {
    if (newProduct.barcode && newProduct.name) {
      const selectedPriceList = priceListOptions.find((pl) => pl.id === returnData.priceList)
      const price = selectedPriceList?.id === "retail" ? 15000 : 12000

      setProducts([
        ...products,
        {
          barcode: newProduct.barcode,
          name: newProduct.name,
          quantity: 1,
          price,
          total: price,
        },
      ])
      setNewProduct({ barcode: "", name: "", unit: "dona" })
      setIsCreateProductOpen(false)
      setBarcodeInput("")
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

  const handlePriceListChange = (priceListId: string) => {
    setReturnData({ ...returnData, priceList: priceListId })
    const selectedPriceList = priceListOptions.find((pl) => pl.id === priceListId)
    const priceKey = selectedPriceList?.key || "purchasePrice"

    const updatedProducts = products.map((product) => {
      const mockProduct = mockProducts.find((p) => p.barcode === product.barcode)
      if (mockProduct) {
        const newPrice = mockProduct[priceKey as keyof typeof mockProduct] as number
        return {
          ...product,
          price: newPrice,
          total: newPrice * product.quantity,
        }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const handleSave = () => {
    if (!returnData.supplier || !returnData.reason || products.length === 0) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!")
      return
    }
    alert("Qaytarish saqlandi!")
    router.push("/qaytarilgan")
  }

  const totalAmount = products.reduce((sum, p) => sum + p.total, 0)
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/qaytarilgan">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yangi qaytarish hujjati</h1>
          <p className="text-sm text-muted-foreground">Ta'minotchiga mahsulot qaytarish</p>
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
                Ta'minotchi <span className="text-red-500">*</span>
              </Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={returnData.supplier}
                onChange={(e) => {
                  const supplier = mockSuppliers.find((s) => s.name === e.target.value)
                  setReturnData({
                    ...returnData,
                    supplier: e.target.value,
                    phone: supplier?.phone || "",
                  })
                }}
              >
                <option value="">Tanlang</option>
                {mockSuppliers.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input value={returnData.phone} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label>Xarid raqami</Label>
              <Input
                placeholder="DOC-001"
                value={returnData.purchaseNumber}
                onChange={(e) => setReturnData({ ...returnData, purchaseNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Qaytarish sababi <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Sabab kiriting"
                value={returnData.reason}
                onChange={(e) => setReturnData({ ...returnData, reason: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Narx ro'yxati <span className="text-red-500">*</span>
              </Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={returnData.priceList}
                onChange={(e) => handlePriceListChange(e.target.value)}
              >
                {priceListOptions.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
            </div>
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
                Summa: <strong className="text-green-600">{totalAmount.toLocaleString()} so'm</strong>
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
                <p className="text-3xl font-bold" style={{ color: "#004B34" }}>
                  {totalAmount.toLocaleString()} so'm
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="lg" onClick={() => router.push("/qaytarilgan")}>
          Bekor qilish
        </Button>
        <Button
          size="lg"
          style={{ backgroundColor: "#004B34" }}
          className="text-white px-8"
          onClick={handleSave}
          disabled={!returnData.supplier || !returnData.reason || products.length === 0}
        >
          Saqlash
        </Button>
      </div>

      {/* Create Product Dialog */}
      <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi mahsulot yaratish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Shtrix-kod *</Label>
              <Input
                placeholder="Shtrix-kod kiriting"
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Mahsulot nomi *</Label>
              <Input
                placeholder="Mahsulot nomini kiriting"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>O'lchov birligi</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              >
                <option value="dona">Dona</option>
                <option value="kg">Kilogramm</option>
                <option value="litr">Litr</option>
                <option value="metr">Metr</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsCreateProductOpen(false)}>
                Bekor qilish
              </Button>
              <Button
                style={{ backgroundColor: "#004B34" }}
                className="text-white"
                onClick={handleCreateProduct}
                disabled={!newProduct.barcode || !newProduct.name}
              >
                Yaratish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
