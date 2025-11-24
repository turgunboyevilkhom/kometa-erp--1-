"use client"

import type React from "react"

import { useState } from "react"
import { Search, Printer, Package, Plus, Trash2, List, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const inventoryData = [
  {
    id: 1,
    name: "Coca-Cola 0.5L",
    barcode: "4870251005766",
    price: "18000",
  },
  {
    id: 2,
    name: "Lays Chips Original 150g",
    barcode: "4870251005773",
    price: "12500",
  },
  {
    id: 3,
    name: "Fanta Orange 1L",
    barcode: "4870251005780",
    price: "25000",
  },
  {
    id: 4,
    name: "Sprite 1.5L",
    barcode: "5449000000996",
    price: "15000",
  },
  {
    id: 5,
    name: "Snickers Chocolate Bar 50g",
    barcode: "5000159461122",
    price: "8500",
  },
  {
    id: 6,
    name: "Oreo Cookies 176g",
    barcode: "7622210449283",
    price: "14000",
  },
  {
    id: 7,
    name: "Pepsi 2L",
    barcode: "4870251005797",
    price: "22000",
  },
  {
    id: 8,
    name: "Nestle Water 0.5L",
    barcode: "7613034626844",
    price: "5000",
  },
  {
    id: 9,
    name: "Pringles Original 165g",
    barcode: "5053990101658",
    price: "28000",
  },
  {
    id: 10,
    name: "Red Bull Energy 250ml",
    barcode: "9002490100001",
    price: "19000",
  },
  {
    id: 11,
    name: "Samsung Galaxy Phone",
    barcode: "8801643686741",
    price: "200000",
  },
  {
    id: 12,
    name: "Apple MacBook Pro",
    barcode: "0194252157358",
    price: "1500000",
  },
]

const labelSizes = [
  { id: "30x20", width: 30, height: 20, label: "30x20 mm (Kichik)" },
  { id: "40x30", width: 40, height: 30, label: "40x30 mm" },
  { id: "60x30", width: 60, height: 30, label: "60x30 mm" },
  { id: "60x40", width: 60, height: 40, label: "60x40 mm (Standart)" },
  { id: "80x50", width: 80, height: 50, label: "80x50 mm" },
  { id: "100x70", width: 100, height: 70, label: "100x70 mm (Katta)" },
  { id: "250x200", width: 250, height: 200, label: "250x200 mm (Reklama)" },
]

type DesignType = "classic" | "minimal" | "bold"

const designs: { id: DesignType; label: string }[] = [
  { id: "classic", label: "Standart" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Katta Narx" },
]

const EAN13Barcode = ({ value }: { value: string }) => {
  const leftPatternA = [
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011",
  ]
  const leftPatternB = [
    "0100111",
    "0110011",
    "0011011",
    "0100001",
    "0011101",
    "0111001",
    "0000101",
    "0010001",
    "0001001",
    "0010111",
  ]
  const rightPattern = [
    "1110010",
    "1100110",
    "1101100",
    "1000010",
    "1011100",
    "1001110",
    "1010000",
    "1000100",
    "1001000",
    "1110100",
  ]
  const firstDigitPattern = [
    "AAAAAA",
    "AABABB",
    "AABBAB",
    "AABBBA",
    "ABAABB",
    "ABBAAB",
    "ABBBAA",
    "ABABAB",
    "ABABBA",
    "ABBABA",
  ]

  const ean13 = value.padEnd(13, "0").substring(0, 13)
  const firstDigit = Number.parseInt(ean13[0])
  const leftDigits = ean13.substring(1, 7)
  const rightDigits = ean13.substring(7, 13)

  let barcode = "101"

  const pattern = firstDigitPattern[firstDigit]
  for (let i = 0; i < 6; i++) {
    const digit = Number.parseInt(leftDigits[i])
    barcode += pattern[i] === "A" ? leftPatternA[digit] : leftPatternB[digit]
  }

  barcode += "01010"

  for (let i = 0; i < 6; i++) {
    const digit = Number.parseInt(rightDigits[i])
    barcode += rightPattern[digit]
  }

  barcode += "101"

  return (
    <div className="flex flex-col items-center justify-end w-full h-full">
      <svg
        viewBox={`0 0 ${barcode.length * 2} 60`}
        className="w-full h-full"
        preserveAspectRatio="none" // Allow stretching to fill width completely
      >
        {barcode
          .split("")
          .map((bit, i) => (bit === "1" ? <rect key={i} x={i * 2} y="0" width="2" height="50" fill="black" /> : null))}
      </svg>
      <span className="text-[10px] font-mono leading-none tracking-[0.2em] w-full text-center block mt-[-4px] bg-white relative z-10">
        {ean13}
      </span>
    </div>
  )
}

const ProductLabel = ({
  product,
  size,
  scale = 1,
  design = "classic",
}: {
  product: (typeof inventoryData)[0]
  size: (typeof labelSizes)[0]
  scale?: number
  design?: DesignType
}) => {
  const baseSize = size.height * scale
  const formattedPrice = Number(product.price).toLocaleString()
  const priceLength = formattedPrice.length

  // If price is longer than 6 chars (e.g. 100,000), scale it down
  const lengthScale = priceLength > 5 ? Math.max(0.6, 5.5 / priceLength) : 1

  if (design === "minimal") {
    const nameSize = Math.max(baseSize * 0.15, 10)
    const priceSize = Math.max(baseSize * 0.35 * lengthScale, 16)

    return (
      <div
        className="bg-white flex flex-col items-center overflow-hidden relative border border-gray-100"
        style={{
          width: `${size.width * scale}px`,
          height: `${size.height * scale}px`,
          padding: `${size.width * 0.03 * scale}px`,
        }}
      >
        <div className="w-full h-full flex flex-col">
          {/* Product Name - Top */}
          <div className="h-[25%] flex items-start justify-center w-full">
            <div
              className="font-medium text-slate-800 leading-tight text-center line-clamp-2 w-full"
              style={{ fontSize: `${nameSize}px` }}
            >
              {product.name}
            </div>
          </div>

          {/* Price - Middle, Huge */}
          <div className="h-[45%] flex items-center justify-center w-full">
            <div className="font-light text-[#004B34] leading-none" style={{ fontSize: `${priceSize}px` }}>
              {formattedPrice}
            </div>
          </div>

          {/* Barcode - Bottom, Small */}
          <div className="h-[30%] w-full flex flex-col items-center justify-end">
            <div className="w-[80%] h-[80%] opacity-80">
              <EAN13Barcode value={product.barcode} />
            </div>
            <div className="text-[8px] text-slate-400 mt-[2px] uppercase tracking-widest text-center w-full">
              Kometa
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (design === "bold") {
    const companySize = Math.max(baseSize * 0.08, 6)
    const nameSize = Math.max(baseSize * 0.12, 9)
    const priceSize = Math.max(baseSize * 0.35 * lengthScale, 18)

    return (
      <div
        className="bg-white flex flex-col items-center overflow-hidden relative border-4 border-[#004B34]"
        style={{
          width: `${size.width * scale}px`,
          height: `${size.height * scale}px`,
          padding: `${size.width * 0.02 * scale}px`,
        }}
      >
        <div className="w-full h-full flex flex-col bg-slate-50">
          {/* Company - Top Small */}
          <div className="h-[10%] flex items-center justify-center w-full bg-[#004B34]">
            <div
              className="font-bold uppercase text-white tracking-widest w-full text-center"
              style={{ fontSize: `${companySize}px` }}
            >
              Kometa
            </div>
          </div>

          {/* Price - Dominant */}
          <div className="h-[40%] flex items-center justify-center w-full border-b-2 border-[#004B34]">
            <div className="font-black text-black leading-none" style={{ fontSize: `${priceSize}px` }}>
              {formattedPrice}
            </div>
          </div>

          {/* Name - Middle */}
          <div className="h-[20%] flex items-center justify-center w-full px-[2%] pt-[1%]">
            <div
              className="font-bold text-slate-700 leading-none text-center line-clamp-1 w-full uppercase"
              style={{ fontSize: `${nameSize}px` }}
            >
              {product.name}
            </div>
          </div>

          {/* Barcode - Bottom */}
          <div className="h-[30%] w-full flex items-end justify-center pb-[1%]">
            <div className="w-[90%] h-full">
              <EAN13Barcode value={product.barcode} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Classic Design (Default)
  const companySize = Math.max(baseSize * 0.1, 8) // 10% of height
  const nameSize = Math.max(baseSize * 0.12, 9) // 12% of height
  const priceSize = Math.max(baseSize * 0.2 * lengthScale, 12) // 20% of height base

  return (
    <div
      className="bg-white flex flex-col items-center overflow-hidden relative border border-gray-200"
      style={{
        width: `${size.width * scale}px`,
        height: `${size.height * scale}px`,
        padding: `${size.width * 0.02 * scale}px`,
      }}
    >
      <div className="w-full h-full flex flex-col justify-between">
        {/* Header: Company Name - 15% height */}
        <div className="h-[15%] flex items-center justify-center w-full">
          <div
            className="font-bold uppercase text-[#004B34] truncate leading-none w-full text-center"
            style={{ fontSize: `${companySize}px` }}
          >
            KOMETA
          </div>
        </div>

        {/* Product Name - 20% height */}
        <div className="h-[20%] flex items-start justify-center w-full px-[2%]">
          <div
            className="font-semibold text-slate-900 leading-none text-center line-clamp-2 w-full break-words"
            style={{ fontSize: `${nameSize}px`, lineHeight: "1.1" }}
          >
            {product.name}
          </div>
        </div>

        {/* Price - 30% height - Centered and Readable */}
        <div className="h-[30%] flex items-center justify-center w-full border-t border-b border-dashed border-gray-200 my-[2%] px-[2%]">
          <div className="font-black text-[#004B34] leading-none tracking-tight" style={{ fontSize: `${priceSize}px` }}>
            {formattedPrice}
          </div>
        </div>

        {/* Barcode - 30% height - Scaled to fit */}
        <div className="h-[30%] w-full flex items-end justify-center overflow-hidden pb-[1%]">
          <div className="w-[95%] h-full">
            <EAN13Barcode value={product.barcode} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PriceLabelsPage() {
  const [barcode, setBarcode] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<(typeof inventoryData)[0] | null>(null)
  const [selectedSize, setSelectedSize] = useState(labelSizes[3])
  const [selectedDesign, setSelectedDesign] = useState<DesignType>("classic")
  const [printQueue, setPrintQueue] = useState<{ product: (typeof inventoryData)[0]; quantity: number }[]>([])
  const [printMode, setPrintMode] = useState<"single" | "batch">("single")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const product = inventoryData.find((item) => item.barcode === barcode)
    if (product) {
      handleProductSelect(product)
      setBarcode("")
    }
  }

  const handleProductSelect = (product: (typeof inventoryData)[0]) => {
    if (printMode === "batch") {
      addToQueue(product)
    } else {
      setSelectedProduct(product)
    }
  }

  const addToQueue = (product: (typeof inventoryData)[0]) => {
    setPrintQueue((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromQueue = (productId: number) => {
    setPrintQueue((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setPrintQueue((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const getPreviewScale = () => {
    const maxWidth = 400 // Max preview width in pixels
    const maxHeight = 400 // Max preview height in pixels

    // Calculate scale to fit within maxWidth x maxHeight
    const scaleByWidth = maxWidth / selectedSize.width
    const scaleByHeight = maxHeight / selectedSize.height

    // Use the smaller scale to ensure it fits in both dimensions
    return Math.min(scaleByWidth, scaleByHeight, 5) // Cap at 5x maximum
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-100 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-[#004B34]">Narx qog'ozlari</h1>
          <p className="text-slate-500">Shtrix-kod orqali narx qog'ozlarini chiqarish</p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={printMode} onValueChange={(v) => setPrintMode(v as "single" | "batch")} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Yakkalik</TabsTrigger>
              <TabsTrigger value="batch">Ko'pplik (A4)</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handlePrint} disabled={printMode === "single" && !selectedProduct} className="bg-[#004B34]">
            <Printer className="mr-2 h-4 w-4" />
            Chop etish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sozlamalar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Shtrix-kod</Label>
                  <div className="flex gap-2">
                    <Input
                      id="barcode"
                      placeholder="Shtrix-kodni skanerlang..."
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      autoFocus
                      className="font-mono"
                    />
                    <Button type="submit" size="icon" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>

              <div className="space-y-2">
                <Label>O'lcham</Label>
                <Select
                  value={selectedSize.id}
                  onValueChange={(val) => setSelectedSize(labelSizes.find((s) => s.id === val) || labelSizes[0])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {labelSizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dizayn</Label>
                <Select value={selectedDesign} onValueChange={(val) => setSelectedDesign(val as DesignType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {designs.map((design) => (
                      <SelectItem key={design.id} value={design.id}>
                        {design.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {printMode === "single" && selectedProduct && (
                <div className="p-4 bg-[#004B34]/5 rounded-lg border border-[#004B34]/20 animate-in fade-in zoom-in duration-300">
                  <h3 className="font-medium text-[#004B34]">{selectedProduct.name}</h3>
                  <p className="text-sm text-slate-500 mb-2 font-mono">{selectedProduct.barcode}</p>
                  <div className="text-2xl font-bold text-[#99C61E]">
                    {Number(selectedProduct.price).toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mahsulotlar ro'yxati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {inventoryData.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${
                        selectedProduct?.id === product.id && printMode === "single"
                          ? "bg-[#004B34] text-white border-[#004B34] ring-2 ring-[#99C61E] ring-offset-2"
                          : "bg-white hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-sm line-clamp-1">{product.name}</div>
                        {printMode === "batch" && <Plus className="h-4 w-4 text-[#99C61E]" />}
                      </div>
                      <div
                        className={`text-xs font-mono mt-1 ${
                          selectedProduct?.id === product.id && printMode === "single"
                            ? "text-white/70"
                            : "text-slate-500"
                        }`}
                      >
                        {product.barcode}
                      </div>
                      <div
                        className={`text-sm font-semibold mt-1 ${
                          selectedProduct?.id === product.id && printMode === "single"
                            ? "text-[#99C61E]"
                            : "text-[#004B34]"
                        }`}
                      >
                        {Number(product.price).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {printMode === "batch" ? (
            <Card className="bg-slate-50 h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Chop etish ro'yxati (A4)
                </CardTitle>
                <Badge variant="secondary" className="text-lg">
                  {printQueue.reduce((acc, item) => acc + item.quantity, 0)} dona
                </Badge>
              </CardHeader>
              <CardContent>
                {printQueue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 border-2 border-dashed rounded-lg">
                    <Grid className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Ro'yxat bo'sh</p>
                    <p className="text-sm mt-2">Mahsulotlarni qo'shish uchun chap tarafdan tanlang</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {printQueue.map((item) => (
                        <div
                          key={item.product.id}
                          className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-[#004B34]">{item.product.name}</h4>
                            <p className="text-xs text-slate-500 font-mono">{item.product.barcode}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-slate-500">Soni:</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value))}
                                className="w-20 h-8 text-center"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromQueue(item.product.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-50 h-full">
              <CardHeader>
                <CardTitle>Ko'rinish</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center min-h-[500px] p-8">
                {selectedProduct ? (
                  <div className="shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <ProductLabel
                      product={selectedProduct}
                      size={selectedSize}
                      scale={getPreviewScale()}
                      design={selectedDesign}
                    />
                  </div>
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Search className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg">Mahsulotni tanlang yoki shtrix-kodni skanerlang</p>
                    <p className="text-sm mt-2">Chap tarafdagi test mahsulotlarni bosing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="hidden print:block absolute top-0 left-0 w-full h-full bg-white z-[9999]">
        {printMode === "single" && selectedProduct ? (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              width: `${selectedSize.width}mm`,
              height: `${selectedSize.height}mm`,
            }}
          >
            <ProductLabel product={selectedProduct} size={selectedSize} scale={3.78} design={selectedDesign} />
          </div>
        ) : (
          <div className="w-[210mm] min-h-[297mm] flex flex-wrap content-start p-[5mm] gap-[2mm]">
            {printQueue.map((item) =>
              Array.from({ length: item.quantity }).map((_, i) => (
                <div key={`${item.product.id}-${i}`} className="break-inside-avoid">
                  <ProductLabel product={item.product} size={selectedSize} scale={3.78} design={selectedDesign} />
                </div>
              )),
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: ${printMode === "batch" ? "A4" : `${selectedSize.width}mm ${selectedSize.height}mm`};
            margin: 0;
          }
          body {
            background: white;
          }
          body > *:not(.print\:block) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
