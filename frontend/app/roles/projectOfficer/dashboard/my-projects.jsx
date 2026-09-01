import React from 'react';
import Link from 'next/link';
const MyProjects = () => {
  const projects = [
    { name: 'Project 1', district: 'District 1', status: 'Acquisition', risk: 'High' },
    { name: 'Project 2', district: 'District 2', status: 'Verification', risk: 'Medium' },
    { name: 'Project 3', district: 'District 3', status: 'Completed', risk: 'Low' },
    { name: 'Project 4', district: 'District 4', status: 'Hold', risk: 'High' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'Acquisition':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'Verification':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'Hold':
        return 'bg-slate-100 text-slate-600 ring-slate-500/20';
      default:
        return 'bg-slate-50 text-slate-600 ring-slate-500/20';
    }
  };

  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'High':
        return 'bg-rose-50 text-rose-700 ring-rose-600/20';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      default:
        return 'bg-slate-50 text-slate-600 ring-slate-500/20';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header */}
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-6 py-4">Project</th>
                <th scope="col" className="px-6 py-4">District</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Risk</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 text-sm">
              {projects.map((item, index) => (
                <tr 
                  key={index} 
                  className="transition-colors hover:bg-slate-50/80 cursor-pointer"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600">{item.district}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getRiskStyle(item.risk)}`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='mt-2'>
        <Link 
  className="flex items-center justify-center text-center w-full text-blue-700 hover:text-blue-500 font-medium text-sm cursor-pointer py-2" 
  href="/roles/project-officer/my-projects"
>
  View All Projects
</Link>
      </div>
    </div>
  );
};

export default MyProjects;