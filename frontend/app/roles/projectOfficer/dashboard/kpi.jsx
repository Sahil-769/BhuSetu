import React from 'react'

const Kpi = ({ title, value }) => {
  return (
    <div className="group relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 active:translate-y-0 active:shadow-md">
  <div className="flex flex-col">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
      {title}
    </h3>
    <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
      {value}
    </p>
  </div>

  {/* Optional trend badge or visual anchor */}
  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors duration-300">
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  </div>
</div>
  )
}

export default Kpi