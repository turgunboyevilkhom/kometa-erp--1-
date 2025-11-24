export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-96 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
