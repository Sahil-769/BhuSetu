"use client";

import {
  Folder,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {Header} from '../../../component/layout/index'
const projects = [
  {
    name: "Delhi-Mumbai Expressway",
    district: "North Delhi",
    status: "In Progress",
    risk: "High",
    parcels: 32,
    verified: 18,
    deadline: "30 Sep 2026",
  },
  {
    name: "Rohini Metro Extension",
    district: "North Delhi",
    status: "Verification",
    risk: "Medium",
    parcels: 24,
    verified: 15,
    deadline: "15 Oct 2026",
  },
  {
    name: "Yamuna Flood Control",
    district: "East Delhi",
    status: "Data Collection",
    risk: "Low",
    parcels: 18,
    verified: 9,
    deadline: "25 Oct 2026",
  },
  {
    name: "Industrial Corridor",
    district: "West Delhi",
    status: "In Progress",
    risk: "Medium",
    parcels: 21,
    verified: 14,
    deadline: "10 Nov 2026",
  },
  {
    name: "Outer Ring Road",
    district: "South Delhi",
    status: "Completed",
    risk: "Low",
    parcels: 15,
    verified: 15,
    deadline: "Completed",
  },
];

export default function MyAssignedProjects() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto py-4 pb-5 px-3">
      <Header title="My Project"/>

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#102d5c]">
            My Assigned Projects
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage projects assigned to you.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
          {projects.length} Projects
        </div>

      </div>


      {/* PROJECT CARDS */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {projects.map((project) => (

          <div
            key={project.name}
            className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >

            {/* TOP */}

            <div className="flex items-start justify-between">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Folder size={24} />
                </div>

                <div>
                  <h2 className="font-bold text-[#102d5c]">
                    {project.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    {project.district}
                  </div>
                </div>

              </div>

              <RiskBadge risk={project.risk} />

            </div>


            {/* STATUS */}

            <div className="mt-5 flex items-center justify-between">

              <span className="text-sm text-gray-500">
                Status
              </span>

              <StatusBadge status={project.status} />

            </div>


            {/* PROGRESS */}

            <div className="mt-5">

              <div className="mb-2 flex justify-between text-sm">

                <span className="text-gray-500">
                  Parcel Verification
                </span>

                <span className="font-semibold text-[#102d5c]">
                  {project.verified}/{project.parcels}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${(project.verified / project.parcels) * 100}%`,
                  }}
                />

              </div>

            </div>


            {/* BOTTOM */}

            <div className="mt-5 flex items-center justify-between border-t pt-4">

              <div className="flex items-center gap-2 text-sm text-gray-500">

                <Calendar size={15} />

                <span>
                  {project.deadline}
                </span>

              </div>

              <button
                className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                View Project
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


/* STATUS */

function StatusBadge({ status }) {

  const styles = {
    "In Progress": "bg-blue-100 text-blue-700",
    Verification: "bg-yellow-100 text-yellow-700",
    "Data Collection": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}


/* RISK */

function RiskBadge({ risk }) {

  const styles = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[risk]
      }`}
    >
      {risk}
    </span>
  );
}