"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  ShoppingCart,
  RotateCcw,
  TrendingDown,
  Wallet,
  Package,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  X,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  submenu?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BarChart2 className="h-5 w-5" />,
    href: "/",
  },
  {
    id: "incoming",
    label: "Kirim hujjatlari",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/yetib-kelgan",
  },
  {
    id: "returns",
    label: "Qaytarilgan mahsulotlar",
    icon: <RotateCcw className="h-5 w-5" />,
    href: "/qaytarilgan",
  },
  {
    id: "writeoffs",
    label: "Tovarlarni hisobdan chiqarish",
    icon: <TrendingDown className="h-5 w-5" />,
    href: "/chiqim",
  },
  {
    id: "cash",
    label: "Kassa",
    icon: <Wallet className="h-5 w-5" />,
    submenu: [
      { label: "Kassa", href: "/kassa" },
      { label: "Harajatlar", href: "/harajatlar" },
      { label: "Yetkazib beruvchilarga to'lovlar", href: "/tolovlar" },
    ],
  },
  {
    id: "warehouse",
    label: "Ombor qoldiqlari",
    icon: <Package className="h-5 w-5" />,
    href: "/ombor",
  },
  {
    id: "price-labels",
    label: "Narx qog'ozlari",
    icon: <Tag className="h-5 w-5" />,
    href: "/narx-qogozlari",
  },
  {
    id: "suppliers",
    label: "Yetkazib beruvchilar",
    icon: <Users className="h-5 w-5" />,
    submenu: [
      { label: "Ro'yxat", href: "/yetkazib-beruvchilar" },
      { label: "Qarzdorlik", href: "/qarzdorlik" },
    ],
  },
  {
    id: "pricing",
    label: "Narxlarni yangilash",
    icon: <DollarSign className="h-5 w-5" />,
    href: "/narxlarni-yangilash",
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["cash", "suppliers"])
  const [hiddenItems, setHiddenItems] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleVisibility = (id: string) => {
    setHiddenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isActive = (href?: string, submenu?: { href: string }[]) => {
    if (href) return pathname === href
    if (submenu) return submenu.some((item) => pathname === item.href)
    return false
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[#004B34] text-white transition-transform duration-300 ease-in-out border-r border-[#99C61E]/30",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between border-b border-[#99C61E]/20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#004B34] font-bold text-xl bg-white">
                K
              </div>
              <span className="text-xl font-bold text-white">Kometa</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-[#005f42]" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu visibility toggle */}
          <div className="px-4 py-3 border-b border-[#99C61E]/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300 hover:bg-[#005f42] hover:text-white"
                >
                  {hiddenItems.length === 0 ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  Menyuni sozlash
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.id} onClick={() => toggleVisibility(item.id)}>
                    {hiddenItems.includes(item.id) ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {navItems
              .filter((item) => !hiddenItems.includes(item.id))
              .map((item) => {
                if (item.submenu) {
                  const isExpanded = expandedItems.includes(item.id)
                  const isItemActive = isActive(undefined, item.submenu)

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                          "text-slate-300 hover:bg-[#005f42] hover:text-white",
                          isItemActive && "bg-[#99C61E] text-[#004B34] font-bold shadow-sm",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={onClose}
                              className={cn(
                                "block px-4 py-2 rounded-lg text-sm transition-colors",
                                "text-slate-300 hover:bg-[#005f42] hover:text-white",
                                pathname === subItem.href && "bg-[#005f42] text-white font-medium",
                              )}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href!}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      "text-slate-300 hover:bg-[#005f42] hover:text-white",
                      isActive(item.href) && "bg-[#99C61E] text-[#004B34] font-bold shadow-sm",
                    )}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
          </nav>
        </div>
      </aside>
    </>
  )
}
