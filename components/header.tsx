"use client"

import type React from "react"

import { useState } from "react"
import { Menu, User, LogOut, Settings, Plus, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false)

  const handleLogout = () => {
    console.log("Logging out...")
    setIsLogoutOpen(false)
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Adding new product...")
    setIsProductModalOpen(false)
  }

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Adding new supplier...")
    setIsSupplierModalOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsProductModalOpen(true)}
              className="bg-[#004B34] hover:bg-[#003822] text-white font-medium shadow-sm hidden sm:flex"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yangi tovar qo'shish
            </Button>

            <Button
              onClick={() => setIsSupplierModalOpen(true)}
              className="bg-[#99C61E] hover:bg-[#7ea518] text-white font-medium shadow-sm hidden sm:flex"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yangi taminotchi qo'shish
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#004B34] text-white font-bold">BU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Business User</p>
                    <p className="text-xs text-muted-foreground">user@kometa.uz</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Sozlamalar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => setIsLogoutOpen(true)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Logout confirmation dialog */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tizimdan chiqish</DialogTitle>
            <DialogDescription>Haqiqatan ham tizimdan chiqmoqchimisiz?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleLogout} className="bg-[#004B34] hover:bg-[#003822] text-white">
              Ha, chiqish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#004B34]" />
              Yangi tovar qo'shish
            </DialogTitle>
            <DialogDescription>Yangi mahsulot ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Mahsulot nomi *</Label>
                  <Input id="product-name" placeholder="Masalan: Coca Cola 1.5L" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-barcode">Shtrix-kod (EAN-13)</Label>
                  <Input id="product-barcode" placeholder="1234567890123" maxLength={13} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-category">Kategoriya</Label>
                  <Input id="product-category" placeholder="Ichimliklar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-unit">O'lchov birligi</Label>
                  <Input id="product-unit" placeholder="dona, kg, litr" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-purchase-price">Kelish narxi *</Label>
                  <Input id="product-purchase-price" type="number" placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-wholesale-price">Ulgurji narx</Label>
                  <Input id="product-wholesale-price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-retail-price">Chakana narx</Label>
                  <Input id="product-retail-price" type="number" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">Tavsif</Label>
                <Textarea id="product-description" placeholder="Qo'shimcha ma'lumotlar..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" className="bg-[#004B34] hover:bg-[#003822] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSupplierModalOpen} onOpenChange={setIsSupplierModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#99C61E]" />
              Yangi taminotchi qo'shish
            </DialogTitle>
            <DialogDescription>Yangi yetkazib beruvchi ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSupplier}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-name">Taminotchi nomi *</Label>
                  <Input id="supplier-name" placeholder="Kompaniya nomi" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-contact">Aloqa shaxsi</Label>
                  <Input id="supplier-contact" placeholder="Ism Familiya" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-phone">Telefon raqami *</Label>
                  <Input id="supplier-phone" placeholder="+998 XX XXX XX XX" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-email">Email</Label>
                  <Input id="supplier-email" type="email" placeholder="email@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier-address">Manzil</Label>
                <Input id="supplier-address" placeholder="To'liq manzil" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier-inn">INN</Label>
                  <Input id="supplier-inn" placeholder="123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-bank">Bank hisob raqami</Label>
                  <Input id="supplier-bank" placeholder="20208..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier-notes">Qo'shimcha ma'lumot</Label>
                <Textarea id="supplier-notes" placeholder="Shartnoma raqami, yetkazib berish shartlari..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSupplierModalOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" className="bg-[#99C61E] hover:bg-[#7ea518] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
