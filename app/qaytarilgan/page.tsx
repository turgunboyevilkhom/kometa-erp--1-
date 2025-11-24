"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Eye, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

const mockReturns = [
  {
    id: 1,
    purchaseNumber: "DOC-001",
    supplier: "Coca-Cola Uzbekistan",
    phone: "+998 90 123 45 67",
    date: "2025-01-15",
    amount: 1650000,
    reason: "Yaroqlilik muddati o'tgan",
    products: [
      { name: "Coca-Cola 0.5L", barcode: "4870251005780", quantity: 50, price: 18000, total: 900000 },
      { name: "Fanta Orange 1L", barcode: "4870251005797", quantity: 30, price: 25000, total: 750000 },
    ],
  },
  {
    id: 2,
    purchaseNumber: "DOC-002",
    supplier: "Elma Chips",
    phone: "+998 91 234 56 78",
    date: "2025-01-14",
    amount: 250000,
    reason: "Shikastlangan qadoq",
    products: [
      { name: "Lays Chips Original 150g", barcode: "4870251005803", quantity: 20, price: 12500, total: 250000 },
    ],
  },
  {
    id: 3,
    purchaseNumber: "DOC-003",
    supplier: "Nestle Uzbekistan",
    phone: "+998 93 345 67 89",
    date: "2025-01-13",
    amount: 890000,
    reason: "Noto'g'ri mahsulot yetkazilgan",
    products: [
      { name: "KitKat Chocolate 45g", barcode: "4870251005810", quantity: 35, price: 14000, total: 490000 },
      { name: "Nescafe Classic 50g", barcode: "4870251005827", quantity: 20, price: 20000, total: 400000 },
    ],
  },
]

export default function ReturnedProductsPage() {
  const router = useRouter()
  const [returns] = useState(mockReturns)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedReturn, setSelectedReturn] = useState<(typeof returns)[0] | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const totalAmount = returns.reduce((sum, ret) => sum + ret.amount, 0)

  const viewDetails = (returnItem: (typeof returns)[0]) => {
    setSelectedReturn(returnItem)
    setIsDetailDialogOpen(true)
  }

  const handleDownloadPDF = (returnItem: (typeof returns)[0]) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Qaytarish Hujjati - ${returnItem.purchaseNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #004B34;
              padding-bottom: 20px;
            }
            .company-name {
              font-size: 32px;
              font-weight: bold;
              color: #004B34;
              margin-bottom: 5px;
            }
            .document-title {
              font-size: 20px;
              color: #666;
            }
            .info-section {
              margin: 30px 0;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .info-item {
              margin-bottom: 10px;
            }
            .info-label {
              font-weight: bold;
              color: #004B34;
            }
            .reason-box {
              background: #f0f9ff;
              border: 2px solid #99C61E;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: #004B34;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .total-section {
              margin-top: 30px;
              text-align: right;
              font-size: 18px;
            }
            .total-amount {
              font-size: 24px;
              font-weight: bold;
              color: #004B34;
              margin-top: 10px;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 2px solid #004B34;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">KOMETA</div>
            <div class="document-title">Qaytarilgan Mahsulotlar Hujjati</div>
          </div>

          <div class="info-section">
            <div>
              <div class="info-item">
                <span class="info-label">Hujjat raqami:</span> ${returnItem.purchaseNumber}
              </div>
              <div class="info-item">
                <span class="info-label">Ta'minotchi:</span> ${returnItem.supplier}
              </div>
            </div>
            <div>
              <div class="info-item">
                <span class="info-label">Sana:</span> ${returnItem.date}
              </div>
              <div class="info-item">
                <span class="info-label">Telefon:</span> ${returnItem.phone}
              </div>
            </div>
          </div>

          <div class="reason-box">
            <strong>Qaytarish sababi:</strong> ${returnItem.reason}
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                <th>Mahsulot nomi</th>
                <th style="width: 150px;">Shtrix-kod</th>
                <th class="text-center" style="width: 100px;">Miqdor</th>
                <th class="text-right" style="width: 120px;">Narx</th>
                <th class="text-right" style="width: 120px;">Jami</th>
              </tr>
            </thead>
            <tbody>
              ${returnItem.products
                .map(
                  (product, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${product.name}</td>
                  <td class="text-center">${product.barcode}</td>
                  <td class="text-center">${product.quantity}</td>
                  <td class="text-right">${product.price.toLocaleString()} UZS</td>
                  <td class="text-right"><strong>${product.total.toLocaleString()} UZS</strong></td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="total-section">
            <div>Jami summa:</div>
            <div class="total-amount">${returnItem.amount.toLocaleString()} UZS</div>
          </div>

          <div class="footer">
            KOMETA - Tovarlarni boshqarish tizimi<br>
            Chop etilgan sana: ${new Date().toLocaleString("uz-UZ")}
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Qaytarilgan mahsulotlar</CardTitle>
            <Button
              style={{ backgroundColor: "#004B34" }}
              className="text-white"
              onClick={() => router.push("/qaytarilgan/add")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Yangi qaytarish
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Filters */}
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label>Boshlang'ich sana</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Tugash sanasi</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Oldingi
            </Button>
            <Button variant="outline">
              Keyingi
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Returns Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Xarid raqami</TableHead>
                  <TableHead>Ta'minotchi</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead className="text-right">Summa</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">{returnItem.purchaseNumber}</TableCell>
                    <TableCell>{returnItem.supplier}</TableCell>
                    <TableCell>{returnItem.phone}</TableCell>
                    <TableCell>{returnItem.date}</TableCell>
                    <TableCell className="text-right font-medium">{returnItem.amount.toLocaleString()} UZS</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => viewDetails(returnItem)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ko'rish
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          style={{ color: "#99C61E", borderColor: "#99C61E" }}
                          onClick={() => handleDownloadPDF(returnItem)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Jami qaytarilganlar</span>
            <span className="text-lg font-bold">{totalAmount.toLocaleString()} so'm</span>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Qaytarilgan mahsulot tafsilotlari</DialogTitle>
              <Button
                size="sm"
                style={{ backgroundColor: "#99C61E" }}
                className="text-white"
                onClick={() => selectedReturn && handleDownloadPDF(selectedReturn)}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF yuklab olish
              </Button>
            </div>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-sm">
                  <strong>Qaytarish sababi:</strong> {selectedReturn.reason}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Ta'minotchi:</p>
                  <p className="font-medium">{selectedReturn.supplier}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefon:</p>
                  <p className="font-medium">{selectedReturn.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Xarid raqami:</p>
                  <p className="font-medium">{selectedReturn.purchaseNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Qaytarish sanasi:</p>
                  <p className="font-medium">{selectedReturn.date}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Qaytarilgan mahsulotlar</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mahsulot</TableHead>
                      <TableHead className="text-center">Miqdor</TableHead>
                      <TableHead className="text-right">Narx</TableHead>
                      <TableHead className="text-right">Jami</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReturn.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-center">{product.quantity}</TableCell>
                        <TableCell className="text-right">{product.price.toLocaleString()} UZS</TableCell>
                        <TableCell className="text-right font-medium">{product.total.toLocaleString()} UZS</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="font-medium">Umumiy summa:</span>
                <span className="text-xl font-bold">
                  {selectedReturn.products.reduce((sum, p) => sum + p.total, 0).toLocaleString()} UZS
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
