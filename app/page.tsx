import { BarChart2, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const stats = [
    {
      title: "Jami mahsulotlar",
      value: "1,234",
      change: "+12.5%",
      icon: Package,
      color: "text-[#004B34]",
    },
    {
      title: "Kirim hujjatlari",
      value: "156",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-[#99C61E]",
    },
    {
      title: "Ombor qiymati",
      value: "45.2M UZS",
      change: "+15.3%",
      icon: TrendingUp,
      color: "text-[#004B34]",
    },
    {
      title: "Faol yetkazuvchilar",
      value: "42",
      change: "+3.1%",
      icon: BarChart2,
      color: "text-[#99C61E]",
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-[#99C61E] font-medium mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-0 shadow-lg bg-[#004B34]">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Kometa ERP tizimiga xush kelibsiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90">
            Bu yerda siz inventar, xaridlar, sotuvlar va moliyaviy operatsiyalarni boshqarishingiz mumkin.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">Tezkor havolalar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">• Yangi kirim hujjati yaratish</div>
            <div className="text-sm text-muted-foreground">• Ombor qoldiqlarini ko'rish</div>
            <div className="text-sm text-muted-foreground">• Kassa hisobotlari</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">So'nggi faoliyat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tez orada ko'rsatiladi...</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">Ogohlantirishlar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Hozircha ogohlantirishlar yo'q</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
