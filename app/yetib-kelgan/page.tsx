"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, Eye, Edit, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Pagination } from "@/components/pagination"

// Mock data
const documents = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  docNumber: `DOC-${String(i + 1).padStart(3, "0")}`,
  date: `2025-01-${Math.floor(Math.random() * 28) + 1}`,
  supplier: ["Coca-Cola Uzbekistan", "Elma Chips", "Pepsi Co", "Mars Inc.", "Nestle"][i % 5],
  warehouse: i % 2 === 0 ? "Asosiy ombor" : "Filial ombor",
  paymentType: i % 3 === 0 ? "Naqd" : "Bank",
  amount: `${(Math.floor(Math.random() * 20000000) + 1000000).toLocaleString()}`,
  itemsCount: Math.floor(Math.random() * 10) + 1,
  status: ["Tasdiqlangan", "Qoralama", "Kutilmoqda", "Bekor qilingan"][i % 4],
  receiver: i % 2 === 0 ? "Javohir Abdullayev" : "Sardor Rahimov",
  notes: i % 3 === 0 ? "Tezkor yetkazib berish talab qilinadi" : "",
  items: [
    {
      barcode: `487025${i}780`,
      name: `Mahsulot ${i + 1}`,
      quantity: Math.floor(Math.random() * 500) + 100,
      unit: "dona",
      purchasePrice: Math.floor(Math.random() * 20000) + 5000,
      markup: i % 4 === 0 ? 10 : i % 4 === 1 ? 20 : i % 4 === 2 ? 30 : 50,
      sellingPrice: 0,
      total: 0,
    },
    {
      barcode: `487025${i + 1}781`,
      name: `Mahsulot ${i + 2}`,
      quantity: Math.floor(Math.random() * 300) + 50,
      unit: "dona",
      purchasePrice: Math.floor(Math.random() * 15000) + 3000,
      markup: i % 3 === 0 ? 15 : i % 3 === 1 ? 25 : 35,
      sellingPrice: 0,
      total: 0,
    },
  ].map((item) => ({
    ...item,
    sellingPrice: item.purchasePrice * (1 + item.markup / 100),
    total: item.quantity * item.purchasePrice,
  })),
}))

const statusColors = {
  Tasdiqlangan: "bg-green-100 text-green-700 hover:bg-green-200",
  Qoralama: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  "Bekor qilingan": "bg-red-100 text-red-700 hover:bg-red-200",
  Kutilmoqda: "bg-blue-100 text-blue-700 hover:bg-blue-200",
}

export default function IncomingDocumentsPage() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<(typeof documents)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const totalPages = Math.ceil(documents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDocuments = documents.slice(startIndex, endIndex)

  const handleEditDocument = (doc: (typeof documents)[0]) => {
    // Navigate to edit page with document ID
    router.push(`/yetib-kelgan/edit/${doc.id}`)
  }

  const handleViewDocument = (doc: (typeof documents)[0]) => {
    setSelectedDoc(doc)
    setViewDialogOpen(true)
  }

  const handleDownloadInvoice = (doc: (typeof documents)[0]) => {
    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${doc.docNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #004B34;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #004B34;
            margin-bottom: 5px;
          }
          .invoice-title {
            font-size: 20px;
            color: #666;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .info-block {
            flex: 1;
          }
          .info-label {
            font-weight: bold;
            color: #004B34;
            margin-bottom: 5px;
          }
          .info-value {
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #004B34;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
          }
          .total-label {
            font-size: 18px;
            font-weight: bold;
            color: #004B34;
          }
          .total-value {
            font-size: 24px;
            font-weight: bold;
            color: #99C61E;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">KOMETA</div>
          <div class="invoice-title">Kirim hujjati</div>
        </div>
        
        <div class="info-section">
          <div class="info-block">
            <div class="info-label">Hujjat raqami:</div>
            <div class="info-value">${doc.docNumber}</div>
            <div class="info-label">Sana:</div>
            <div class="info-value">${doc.date}</div>
          </div>
          <div class="info-block">
            <div class="info-label">Ta'minotchi:</div>
            <div class="info-value">${doc.supplier}</div>
            <div class="info-label">Ombor:</div>
            <div class="info-value">${doc.warehouse}</div>
          </div>
          <div class="info-block">
            <div class="info-label">To'lov turi:</div>
            <div class="info-value">${doc.paymentType}</div>
            <div class="info-label">Status:</div>
            <div class="info-value">${doc.status}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Mahsulot nomi</th>
              <th style="text-align: right;">Soni</th>
              <th style="text-align: right;">Narxi</th>
              <th style="text-align: right;">Jami</th>
            </tr>
          </thead>
          <tbody>
            ${doc.items
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name || ""}</td>
                <td style="text-align: right;">${item.quantity || 0}</td>
                <td style="text-align: right;">${(item.purchasePrice || 0).toLocaleString()} UZS</td>
                <td style="text-align: right;">${(item.total || 0).toLocaleString()} UZS</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-label">Jami summa:</div>
          <div class="total-value">${doc.amount} UZS</div>
        </div>

        <div class="footer">
          KOMETA ERP System | Yaratilgan: ${new Date().toLocaleDateString("uz-UZ")}
        </div>
      </body>
      </html>
    `

    // Create a blob and download
    const blob = new Blob([invoiceHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Invoice-${doc.docNumber}-${doc.date}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Also open in new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kirim hujjatlari</h1>
          <p className="text-sm text-muted-foreground mt-1">Jami: {documents.length} ta hujjat</p>
        </div>
        <Link href="/yetib-kelgan/add">
          <Button className="bg-[#004B34] hover:bg-[#003826] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Yangi hujjat
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filtrlar
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="confirmed">Tasdiqlangan</SelectItem>
                  <SelectItem value="draft">Qoralama</SelectItem>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Ta'minotchi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="coca">Coca-Cola</SelectItem>
                  <SelectItem value="elma">Elma Chips</SelectItem>
                </SelectContent>
              </Select>

              <Input type="date" placeholder="Sanadan" />
              <Input type="date" placeholder="Sanagacha" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hujjatlar ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hujjat raqami</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Ta'minotchi</TableHead>
                  <TableHead>Ombor</TableHead>
                  <TableHead>To'lov</TableHead>
                  <TableHead className="text-right">Summa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.docNumber}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>{doc.supplier}</TableCell>
                    <TableCell>{doc.warehouse}</TableCell>
                    <TableCell>{doc.paymentType}</TableCell>
                    <TableCell className="text-right">
                      {doc.amount} <span className="text-muted-foreground">UZS</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[doc.status as keyof typeof statusColors]} cursor-pointer`}
                        onClick={() => {
                          const fullDoc = documents.find((d) => d.id === doc.id)
                          if (fullDoc) {
                            setSelectedDoc(fullDoc)
                            setStatusDialogOpen(true)
                          }
                        }}
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleViewDocument(doc)} title="Ko'rish">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDownloadInvoice(doc)}
                          title="Yuklab olish"
                        >
                          <Download className="h-4 w-4 text-green-600" />
                        </Button>
                        {doc.status === "Qoralama" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Tahrirlash"
                            onClick={() => handleEditDocument(doc)}
                          >
                            <Edit className="h-4 w-4 text-amber-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, documents.length)} dan {documents.length} ta ko'rsatilmoqda
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </CardContent>
      </Card>

      {/* View/Download Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="!max-w-none w-[98vw] h-[95vh] overflow-hidden flex flex-col p-2">
          <DialogHeader className="px-4 pt-2">
            <DialogTitle className="text-xl">Hujjat ma'lumotlari: {selectedDoc?.docNumber}</DialogTitle>
            <DialogDescription>
              {selectedDoc?.date} | {selectedDoc?.supplier}
            </DialogDescription>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4 overflow-y-auto px-4 pb-4 flex-1">
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Asosiy ma'lumotlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="font-semibold text-slate-600 mb-1">Ta'minotchi:</p>
                      <p className="text-slate-900">{selectedDoc.supplier}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600 mb-1">Ombor:</p>
                      <p className="text-slate-900">{selectedDoc.warehouse}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600 mb-1">Sana:</p>
                      <p className="text-slate-900">{selectedDoc.date}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600 mb-1">To'lov turi:</p>
                      <p className="text-slate-900">{selectedDoc.paymentType}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600 mb-1">Qabul qiluvchi:</p>
                      <p className="text-slate-900">{selectedDoc.receiver}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600 mb-1">Status:</p>
                      <Badge className={statusColors[selectedDoc.status as keyof typeof statusColors]}>
                        {selectedDoc.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedDoc.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="font-semibold text-slate-600 mb-1">Izohlar:</p>
                      <p className="text-slate-900">{selectedDoc.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Mahsulotlar ro'yxati</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[1200px]">
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-semibold whitespace-nowrap min-w-[50px]">№</TableHead>
                          <TableHead className="font-semibold whitespace-nowrap min-w-[120px]">Shtrix-kod</TableHead>
                          <TableHead className="font-semibold whitespace-nowrap min-w-[200px]">Mahsulot</TableHead>
                          <TableHead className="font-semibold text-center whitespace-nowrap min-w-[80px]">
                            Miqdor
                          </TableHead>
                          <TableHead className="font-semibold text-center whitespace-nowrap min-w-[70px]">
                            Birlik
                          </TableHead>
                          <TableHead className="font-semibold text-right whitespace-nowrap min-w-[120px]">
                            Tan narx
                          </TableHead>
                          <TableHead className="font-semibold text-center whitespace-nowrap min-w-[100px]">
                            Ustama %
                          </TableHead>
                          <TableHead className="font-semibold text-right whitespace-nowrap min-w-[120px]">
                            Sotish narxi
                          </TableHead>
                          <TableHead className="font-semibold text-right whitespace-nowrap min-w-[120px]">
                            Jami
                          </TableHead>
                          <TableHead className="font-semibold text-right whitespace-nowrap min-w-[120px]">
                            Foyda
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDoc.items?.map((item, index) => {
                          const totalSelling = item.quantity * item.sellingPrice
                          const profit = totalSelling - item.total
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell className="text-slate-600 whitespace-nowrap">{item.barcode}</TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-center text-slate-600">{item.unit}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                {item.purchasePrice.toLocaleString()}{" "}
                                <span className="text-xs text-muted-foreground">UZS</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="bg-blue-50">
                                  {item.markup}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                {item.sellingPrice.toLocaleString()}{" "}
                                <span className="text-xs text-muted-foreground">UZS</span>
                              </TableCell>
                              <TableCell className="text-right font-medium whitespace-nowrap">
                                {item.total.toLocaleString()} <span className="text-xs text-muted-foreground">UZS</span>
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <span className="text-green-600 font-semibold">
                                  +{profit.toLocaleString()} <span className="text-xs">UZS</span>
                                </span>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-4 gap-4">
                {(() => {
                  const totalPurchase = selectedDoc.items?.reduce((sum, item) => sum + item.total, 0) || 0
                  const totalSelling =
                    selectedDoc.items?.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0) || 0
                  const totalProfit = totalSelling - totalPurchase
                  const profitPercentage = totalPurchase > 0 ? (totalProfit / totalPurchase) * 100 : 0

                  return (
                    <>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                          <p className="text-sm text-blue-600 font-semibold mb-1">Jami tan narx</p>
                          <p className="text-2xl font-bold text-blue-900">{totalPurchase.toLocaleString()} UZS</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-6">
                          <p className="text-sm text-purple-600 font-semibold mb-1">Jami sotish narxi</p>
                          <p className="text-2xl font-bold text-purple-900">{totalSelling.toLocaleString()} UZS</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                          <p className="text-sm text-green-600 font-semibold mb-1">Jami foyda</p>
                          <p className="text-2xl font-bold text-green-900">+{totalProfit.toLocaleString()} UZS</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="pt-6">
                          <p className="text-sm text-amber-600 font-semibold mb-1">Foyda foizi</p>
                          <p className="text-2xl font-bold text-amber-900">{profitPercentage.toFixed(1)}%</p>
                        </CardContent>
                      </Card>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          <DialogFooter className="px-4 pb-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Yopish
            </Button>
            <Button
              style={{ backgroundColor: "#004B34" }}
              className="text-white"
              onClick={() => selectedDoc && handleDownloadInvoice(selectedDoc)}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF yuklash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Statusni o'zgartirish</DialogTitle>
            <DialogDescription>Hujjat statusini tanlang</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Tasdiqlangan
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Qoralama
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Kutilmoqda
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Bekor qilingan
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Bekor qilish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
