"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Search, Package, Calculator, Upload, X, FileText, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

const mockProducts = [
  { barcode: "4870251005780", name: "Fanta Orange 1L", stock: 150 },
  { barcode: "4870251005773", name: "Coca Cola 2L", stock: 200 },
  { barcode: "8994963265461", name: "Pepsi 1.5L", stock: 180 },
  { barcode: "4607065380038", name: "Nestle Coffee", stock: 45 },
  { barcode: "4870251005797", name: "Sprite 1L", stock: 120 },
]

export default function AddDocumentPage() {
  const router = useRouter()
  const [scannerInput, setScannerInput] = useState("")
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    name: "",
    unit: "dona",
  })
  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: 1,
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

  const [formData, setFormData] = useState({
    supplier: "",
    warehouse: "",
    date: new Date().toISOString().split("T")[0],
    paymentType: "",
    receiver: "",
    docNumber: `DOC-${Date.now().toString().slice(-6)}`,
    notes: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const addProductRow = () => {
    setProducts([
      ...products,
      {
        id: products.length + 1,
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

    console.log("[v0] Saving document:", { formData, products: validProducts, files: uploadedFiles, isDraft })
    alert(isDraft ? "Qoralama saqlandi!" : "Hujjat tasdiqlandi!")
    router.push("/yetib-kelgan")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Fayl hajmi 10MB dan oshmasligi kerak: ${file.name}`)
        return
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        alert(`Faqat rasm (JPG, PNG) yoki PDF fayllarni yuklash mumkin: ${file.name}`)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const newFile: UploadedFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: event.target?.result as string,
        }
        setUploadedFiles((prev) => [...prev, newFile])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    e.target.value = ""
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleScannerInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && scannerInput.length >= 8) {
      const found = mockProducts.find((p) => p.barcode === scannerInput)
      if (found) {
        const existingProduct = products.find((p) => p.barcode === scannerInput)

        if (existingProduct) {
          setProducts((prev) => prev.map((p) => (p.barcode === scannerInput ? { ...p, quantity: p.quantity + 1 } : p)))
        } else {
          setProducts((prev) => [
            ...prev,
            {
              id: Date.now(),
              barcode: found.barcode,
              name: found.name,
              currentStock: found.stock,
              quantity: 1,
              unit: "dona",
              purchasePrice: 0,
              markup: 0,
              sellingPrice: 0,
              manualPriceOverride: false,
            },
          ])
        }
        setScannerInput("")
      } else {
        alert("Mahsulot topilmadi!")
      }
    }
  }

  const handleCreateNewProduct = () => {
    setNewProduct({ barcode: scannerInput, name: "", unit: "dona" })
    setIsCreateProductOpen(true)
  }

  const saveNewProduct = () => {
    if (!newProduct.name || !newProduct.barcode) {
      alert("Mahsulot nomi va shtrix-kodni kiriting!")
      return
    }

    // Add new product to the table
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        barcode: newProduct.barcode,
        name: newProduct.name,
        currentStock: 0,
        quantity: 1,
        unit: newProduct.unit,
        purchasePrice: 0,
        markup: 0,
        sellingPrice: 0,
        manualPriceOverride: false,
      },
    ])

    // Reset and close modal
    setNewProduct({ barcode: "", name: "", unit: "dona" })
    setIsCreateProductOpen(false)
    setScannerInput("")
  }

  const totalPurchase = products.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0)
  const totalSelling = products.reduce((sum, p) => sum + p.quantity * p.sellingPrice, 0)
  const totalProfit = totalSelling - totalPurchase

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-200">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Yangi kirim hujjati</h1>
            <p className="text-sm text-slate-600 mt-1">Mahsulotlarni qo'shing va narxlarni belgilang</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-xs text-slate-600">Mahsulotlar</div>
            <div className="text-lg font-bold text-slate-900">{products.filter((p) => p.name).length}</div>
          </div>
          <div className="h-10 w-px bg-slate-300" />
          <div className="text-center">
            <div className="text-xs text-slate-600">Jami miqdor</div>
            <div className="text-lg font-bold text-slate-900">{products.reduce((sum, p) => sum + p.quantity, 0)}</div>
          </div>
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
              <Select value={formData.paymentType} onValueChange={(v) => setFormData({ ...formData, paymentType: v })}>
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

            <div className="space-y-3 md:col-span-3">
              <Label className="text-slate-700 font-medium">Hujjat rasmlari va fayllari</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#99C61E] hover:bg-slate-50 transition-colors">
                  <Upload className="h-4 w-4 text-[#004B34]" />
                  <span className="text-sm text-slate-700">Fayl yuklash</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500">JPG, PNG, PDF (Maks. 10MB)</span>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="relative group bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      {file.type.startsWith("image/") ? (
                        <div className="aspect-video bg-slate-100 rounded overflow-hidden mb-2">
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-slate-100 rounded flex items-center justify-center mb-2">
                          <FileText className="h-12 w-12 text-slate-400" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Shtrix-kodni skan qiling yoki kiriting..."
                value={scannerInput}
                onChange={(e) => setScannerInput(e.target.value)}
                onKeyDown={handleScannerInput}
                className="h-12 text-lg border-2 border-slate-300 focus:border-[#004B34] pr-12"
                autoFocus
              />
              <Scan className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
            <Button
              onClick={handleCreateNewProduct}
              className="h-12 w-12 bg-[#004B34] hover:bg-[#003825] text-white"
              size="icon"
              title="Yangi mahsulot yaratish"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              className="h-12 px-4 border-2 border-[#004B34] text-[#004B34] hover:bg-[#004B34] hover:text-white bg-transparent"
              title="Skaner rejimi"
            >
              <Scan className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Shtrix-kodni skan qiling va Enter bosing. Topilmagan mahsulotni + tugmasi orqali qo'shing.
          </p>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[#004B34]" />
              <CardTitle className="text-slate-900">Mahsulotlar ro'yxati</CardTitle>
            </div>
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
                        className={`w-28 text-right ${
                          product.manualPriceOverride ? "border-amber-500 bg-amber-50" : "border-slate-300"
                        }`}
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {(product.quantity * product.sellingPrice).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {products.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => removeProductRow(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button
            variant="outline"
            className="mt-4 border-[#99C61E] text-[#004B34] hover:bg-[#99C61E] hover:text-[#004B34] bg-transparent"
            onClick={addProductRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Qator qo'shish
          </Button>
        </CardContent>
        <CardFooter className="flex-col items-start gap-3 border-t border-slate-200 pt-6 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            <div className="space-y-1">
              <span className="text-xs text-slate-600">Mahsulotlar soni</span>
              <div className="text-2xl font-bold text-slate-900">{products.filter((p) => p.name).length}</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-600">Xarid summasi</span>
              <div className="text-2xl font-bold text-[#004B34]">{totalPurchase.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-600">Sotish summasi</span>
              <div className="text-2xl font-bold text-[#99C61E]">{totalSelling.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-600">Foyda</span>
              <div className="text-2xl font-bold text-green-600">+{totalProfit.toLocaleString()}</div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-lg border border-slate-200">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSave(true)}
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          Qoralama sifatida saqlash
        </Button>
        <Button size="lg" className="bg-[#004B34] hover:bg-[#003d2a] text-white px-8" onClick={() => handleSave(false)}>
          Tasdiqlash va saqlash
        </Button>
      </div>

      <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004B34]">Yangi mahsulot yaratish</DialogTitle>
            <DialogDescription>Yangi mahsulot ma'lumotlarini kiriting va saqlang.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-barcode" className="text-slate-700 font-medium">
                Shtrix-kod *
              </Label>
              <Input
                id="new-barcode"
                placeholder="4870251005780"
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                className="border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-name" className="text-slate-700 font-medium">
                Mahsulot nomi *
              </Label>
              <Input
                id="new-name"
                placeholder="Fanta Orange 1L"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-unit" className="text-slate-700 font-medium">
                O'lchov birligi
              </Label>
              <Select value={newProduct.unit} onValueChange={(v) => setNewProduct({ ...newProduct, unit: v })}>
                <SelectTrigger id="new-unit" className="border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dona">dona</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="litr">litr</SelectItem>
                  <SelectItem value="metr">metr</SelectItem>
                  <SelectItem value="quti">quti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateProductOpen(false)}
              className="border-slate-300 text-slate-700"
            >
              Bekor qilish
            </Button>
            <Button onClick={saveNewProduct} className="bg-[#004B34] hover:bg-[#003825] text-white">
              Saqlash va qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
