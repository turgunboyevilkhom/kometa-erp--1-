"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Search, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

interface ProductRow {
  id: number
  barcode: string
  name: string
  currentStock: number
  quantity: number
  unit: string
  purchasePrice: number
  markup: number
  sellingPrice: number
  manualPriceOverride: boolean
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
}

// Mock existing document data
const getDocumentById = (id: string) => {
  return {
    id,
    docNumber: `DOC-${id}`,
    supplier: "coca",
    warehouse: "main",
    date: "2024-01-15",
    paymentType: "cash",
    receiver: "Ali Valiyev",
    notes: "Tez yetkazib berish kerak",
    items: [
      {
        id: 1,
        barcode: "4870251005780",
        name: "Fanta Orange 1L",
        currentStock: 150,
        quantity: 50,
        unit: "dona",
        purchasePrice: 8000,
        markup: 25,
        sellingPrice: 10000,
        manualPriceOverride: false,
      },
      {
        id: 2,
        barcode: "4870251005773",
        name: "Coca Cola 2L",
        currentStock: 200,
        quantity: 100,
        unit: "dona",
        purchasePrice: 12000,
        markup: 30,
        sellingPrice: 15600,
        manualPriceOverride: false,
      },
    ],
  }
}

export default function EditDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params?.id as string

  const [products, setProducts] = useState<ProductRow[]>([])
  const [formData, setFormData] = useState({
    supplier: "",
    warehouse: "",
    date: "",
    paymentType: "",
    receiver: "",
    docNumber: "",
    notes: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    if (documentId) {
      const doc = getDocumentById(documentId)
      setFormData({
        supplier: doc.supplier,
        warehouse: doc.warehouse,
        date: doc.date,
        paymentType: doc.paymentType,
        receiver: doc.receiver,
        docNumber: doc.docNumber,
        notes: doc.notes,
      })
      setProducts(doc.items)
    }
  }, [documentId])

  const addProductRow = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        barcode: "",
        name: "",
        currentStock: 0,
        quantity: 0,
        unit: "dona",
        purchasePrice: 0,
        markup: 0,
        sellingPrice: 0,
        manualPriceOverride: false,
      },
    ])
  }

  const removeProductRow = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleBarcodeSearch = (id: number, barcode: string) => {
    updateProduct(id, "barcode", barcode)

    if (barcode.length >= 8) {
      const mockProducts = [
        { barcode: "4870251005780", name: "Fanta Orange 1L", stock: 150 },
        { barcode: "4870251005773", name: "Coca Cola 2L", stock: 200 },
        { barcode: "8994963265461", name: "Pepsi 1.5L", stock: 180 },
      ]
      const found = mockProducts.find((p) => p.barcode === barcode)
      if (found) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, name: found.name, currentStock: found.stock, quantity: 1 } : p)),
        )
      }
    }
  }

  const updateProduct = (id: number, field: keyof ProductRow, value: any) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value }

          if (field === "sellingPrice") {
            updated.manualPriceOverride = true
            if (updated.purchasePrice > 0) {
              updated.markup = ((updated.sellingPrice - updated.purchasePrice) / updated.purchasePrice) * 100
            }
          } else if (field === "purchasePrice" || field === "markup") {
            if (!updated.manualPriceOverride) {
              updated.sellingPrice = updated.purchasePrice * (1 + updated.markup / 100)
            } else {
              if (field === "purchasePrice" && updated.purchasePrice > 0) {
                updated.markup = ((updated.sellingPrice - updated.purchasePrice) / updated.purchasePrice) * 100
              }
            }
          }

          return updated
        }
        return p
      }),
    )
  }

  const applyBulkMarkup = (markupPercent: number) => {
    setProducts(
      products.map((p) => ({
        ...p,
        markup: markupPercent,
        sellingPrice: p.purchasePrice * (1 + markupPercent / 100),
        manualPriceOverride: false,
      })),
    )
  }

  const handleSave = (isDraft: boolean) => {
    const emptyFields = []
    if (!formData.supplier) emptyFields.push("Ta'minotchi")
    if (!formData.warehouse) emptyFields.push("Ombor")

    const validProducts = products.filter((p) => p.name && p.quantity > 0)
    if (validProducts.length === 0) {
      alert("Kamida bitta mahsulot qo'shing!")
      return
    }

    if (!isDraft && emptyFields.length > 0) {
      alert(`Quyidagi maydonlarni to'ldiring: ${emptyFields.join(", ")}`)
      return
    }

    console.log("[v0] Updating document:", { id: documentId, formData, products: validProducts, isDraft })
    alert(isDraft ? "Qoralama saqlandi!" : "Hujjat tahrirlandi!")
    router.push("/yetib-kelgan")
  }

  const totalPurchase = products.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0)
  const totalSelling = products.reduce((sum, p) => sum + p.quantity * p.sellingPrice, 0)
  const totalProfit = totalSelling - totalPurchase

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/yetib-kelgan")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Hujjatni tahrirlash</h1>
              <p className="text-sm text-slate-600">{formData.docNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => handleSave(true)} className="border-slate-300">
              Qoralama saqlash
            </Button>
            <Button
              style={{ backgroundColor: "#004B34" }}
              className="text-white hover:opacity-90"
              onClick={() => handleSave(false)}
            >
              Saqlash
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900">Hujjat ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Ta'minotchi *</Label>
                <Select value={formData.supplier} onValueChange={(v) => setFormData({ ...formData, supplier: v })}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coca">Coca-Cola Uzbekistan</SelectItem>
                    <SelectItem value="elma">Elma Chips</SelectItem>
                    <SelectItem value="pepsi">Pepsi Co</SelectItem>
                    <SelectItem value="nestle">Nestle Uzbekistan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Ombor *</Label>
                <Select value={formData.warehouse} onValueChange={(v) => setFormData({ ...formData, warehouse: v })}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Asosiy ombor</SelectItem>
                    <SelectItem value="branch">Filial ombor</SelectItem>
                    <SelectItem value="secondary">Ikkinchi ombor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Sana *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">To'lov turi *</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(v) => setFormData({ ...formData, paymentType: v })}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Naqd</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="card">Plastik karta</SelectItem>
                    <SelectItem value="credit">Nasiya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Qabul qiluvchi</Label>
                <Input
                  placeholder="Ism familiya"
                  value={formData.receiver}
                  onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Hujjat raqami</Label>
                <Input
                  placeholder="DOC-XXX"
                  value={formData.docNumber}
                  onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label className="text-slate-700 font-medium">Izoh</Label>
                <Textarea
                  placeholder="Qo'shimcha ma'lumotlar..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="border-slate-300 resize-none"
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900">Mahsulotlar ro'yxati</CardTitle>
              <div className="flex items-center gap-3">
                <Calculator className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-700 font-medium">Hammaga ustama:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyBulkMarkup(10)}
                  className="border-[#004B34] text-[#004B34] hover:bg-[#004B34] hover:text-white"
                >
                  10%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyBulkMarkup(20)}
                  className="border-[#004B34] text-[#004B34] hover:bg-[#004B34] hover:text-white"
                >
                  20%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyBulkMarkup(30)}
                  className="border-[#004B34] text-[#004B34] hover:bg-[#004B34] hover:text-white"
                >
                  30%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyBulkMarkup(50)}
                  className="border-[#99C61E] text-[#004B34] hover:bg-[#99C61E] hover:text-[#004B34]"
                >
                  50%
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">№</TableHead>
                    <TableHead className="font-semibold text-slate-700">Shtrix-kod</TableHead>
                    <TableHead className="font-semibold text-slate-700">Nomi</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Qoldiq</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Miqdor</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Birlik</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Tan narx</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Ustama %</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Sotish narxi</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Jami</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={product.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                      <TableCell>
                        <div className="relative">
                          <Input
                            placeholder="Skan qiling..."
                            value={product.barcode}
                            onChange={(e) => handleBarcodeSearch(product.id, e.target.value)}
                            className="pr-8 border-slate-300"
                          />
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Mahsulot nomi"
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                          className="min-w-[200px] border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded">
                          {product.currentStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.quantity || ""}
                          onChange={(e) => updateProduct(product.id, "quantity", Number(e.target.value))}
                          className="w-20 text-center border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-slate-600">{product.unit}</span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.purchasePrice || ""}
                          onChange={(e) => updateProduct(product.id, "purchasePrice", Number(e.target.value))}
                          className="w-28 text-right border-slate-300"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.markup || ""}
                          onChange={(e) => updateProduct(product.id, "markup", Number(e.target.value))}
                          className="w-20 text-center border-slate-300"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.sellingPrice || ""}
                          onChange={(e) => updateProduct(product.id, "sellingPrice", Number(e.target.value))}
                          className={`w-28 text-right ${product.manualPriceOverride ? "border-amber-400 bg-amber-50" : "border-slate-300"}`}
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-700">
                        {(product.quantity * product.sellingPrice).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" onClick={() => removeProductRow(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={addProductRow} className="border-slate-300 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Qo'shish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Jami tan narx</p>
                <p className="text-2xl font-bold" style={{ color: "#004B34" }}>
                  {totalPurchase.toLocaleString()} UZS
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Jami sotish narxi</p>
                <p className="text-2xl font-bold" style={{ color: "#99C61E" }}>
                  {totalSelling.toLocaleString()} UZS
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Jami foyda</p>
                <p className="text-2xl font-bold text-emerald-600">{totalProfit.toLocaleString()} UZS</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
