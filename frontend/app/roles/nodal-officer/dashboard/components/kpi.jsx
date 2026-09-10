import React from 'react';
const kpiData = [
  {
    id: 'total-projects',
    label: 'Total Projects',
    value: 3,
    icon: (
      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'high-risk',
    label: 'High Risk Projects',
    value: 4,
    icon: (
      <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'pending-interventions',
    label: 'Pending Interventions',
    value: 5,
    icon: (
      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badgeColor: 'bg-amber-100 text-amber-700 ',
  },
  {
    id: 'completed-projects',
    label: 'Completed Projects',
    value: 12,
    icon: (
      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
];

const KpiCards = () => {
  return (
    <section className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiData.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between p-5 bg-white border border-slate-200/80  rounded-xl shadow-xs hover:shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-800 leading-tight">
                {item.label}
              </span>
              <div className={`p-2.5 rounded-lg ${item.badgeColor} transition-transform group-hover:scale-105`}>
                {item.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-auto">
              <span className="text-3xl font-bold tracking-tight text-slate-900 ">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KpiCards;