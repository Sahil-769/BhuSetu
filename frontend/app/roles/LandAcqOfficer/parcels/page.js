"use client";

import { useState } from "react";
import {
  Folder,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const projects = [
  {
    id: "PRJ-001",
    name: "Delhi-Mumbai Expressway",
    district: "North Delhi",
    status: "In Progress",
    risk: "High",
    parcels: [
      {
        id: "P-1023",
        owner: "Mohammad Ahmed",
        location: "Rohini",
        area: "2.4 Acres",
        status: "Pending",
        risk: "High",
      },
      {
        id: "P-1024",
        owner: "Rajesh Kumar",
        location: "Bawana",
        area: "1.8 Acres",
        status: "Verified",
        risk: "Low",
      },
      {
        id: "P-1025",
        owner: "Amit Sharma",
        location: "Narela",
        area: "3.2 Acres",
        status: "Pending",
        risk: "Medium",
      },
      {
        id: "P-1026",
        owner: "Fatima Khan",
        location: "Alipur",
        area: "1.2 Acres",
        status: "Under Review",
        risk: "Medium",
      },
    ],
  },

  {
    id: "PRJ-002",
    name: "Rohini Metro Extension",
    district: "North Delhi",
    status: "Verification",
    risk: "Medium",
    parcels: [
      {
        id: "P-2021",
        owner: "Arjun Singh",
        location: "Rohini",
        area: "2.1 Acres",
        status: "Verified",
        risk: "Low",
      },
      {
        id: "P-2022",
        owner: "Imran Khan",
        location: "Rithala",
        area: "1.5 Acres",
        status: "Pending",
        risk: "Medium",
      },
      {
        id: "P-2023",
        owner: "Suresh Yadav",
        location: "Begumpur",
        area: "2.8 Acres",
        status: "Pending",
        risk: "High",
      },
    ],
  },

  {
    id: "PRJ-003",
    name: "Yamuna Flood Control",
    district: "East Delhi",
    status: "Data Collection",
    risk: "Low",
    parcels: [
      {
        id: "P-3021",
        owner: "Ramesh Gupta",
        location: "Mayur Vihar",
        area: "1.4 Acres",
        status: "Verified",
        risk: "Low",
      },
      {
        id: "P-3022",
        owner: "Nadeem Ali",
        location: "Patparganj",
        area: "2.2 Acres",
        status: "Pending",
        risk: "Low",
      },
      {
        id: "P-3023",
        owner: "Vikas Sharma",
        location: "Laxmi Nagar",
        area: "1.7 Acres",
        status: "Under Review",
        risk: "Medium",
      },
    ],
  },

  {
    id: "PRJ-004",
    name: "Industrial Corridor",
    district: "West Delhi",
    status: "In Progress",
    risk: "Medium",
    parcels: [
      {
        id: "P-4021",
        owner: "Manoj Kumar",
        location: "Najafgarh",
        area: "3.5 Acres",
        status: "Verified",
        risk: "Low",
      },
      {
        id: "P-4022",
        owner: "Salman Ahmed",
        location: "Dwarka",
        area: "2.6 Acres",
        status: "Pending",
        risk: "Medium",
      },
      {
        id: "P-4023",
        owner: "Deepak Verma",
        location: "Uttam Nagar",
        area: "1.9 Acres",
        status: "Pending",
        risk: "High",
      },
    ],
  },
];

export default function ParcelVerification() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");

  /*
   * ============================================
   * PROJECT PARCELS VIEW
   * ============================================
   */

  if (selectedProject) {
    const parcels = selectedProject.parcels.filter(
      (parcel) =>
        parcel.id.toLowerCase().includes(search.toLowerCase()) ||
        parcel.owner.toLowerCase().includes(search.toLowerCase()) ||
        parcel.location.toLowerCase().includes(search.toLowerCase())
    );

    const total = selectedProject.parcels.length;

    const verified = selectedProject.parcels.filter(
      (p) => p.status === "Verified"
    ).length;

    const pending = selectedProject.parcels.filter(
      (p) => p.status === "Pending"
    ).length;

    const review = selectedProject.parcels.filter(
      (p) => p.status === "Under Review"
    ).length;

    return (
      <div className="space-y-6">

        {/* BACK BUTTON */}

        <button
          onClick={() => {
            setSelectedProject(null);
            setSearch("");
          }}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        {/* PROJECT HEADER */}

        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Folder size={28} />
              </div>

              <div>

                <p className="text-xs font-semibold text-blue-600">
                  {selectedProject.id}
                </p>

                <h1 className="text-2xl font-bold text-[#102d5c]">
                  {selectedProject.name}
                </h1>

                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={15} />
                  {selectedProject.district}
                </div>

              </div>

            </div>

            <RiskBadge risk={selectedProject.risk} />

          </div>

        </div>

        {/* STATISTICS */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <StatCard
            title="Total Parcels"
            value={total}
            icon={<MapPin size={22} />}
          />

          <StatCard
            title="Verified"
            value={verified}
            icon={<CheckCircle size={22} />}
          />

          <StatCard
            title="Pending"
            value={pending}
            icon={<Clock size={22} />}
          />

          <StatCard
            title="Under Review"
            value={review}
            icon={<AlertTriangle size={22} />}
          />

        </div>

        {/* PARCEL TABLE */}

        <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-4 border-b p-5 md:flex-row md:items-center">

            <div>
              <h2 className="text-lg font-bold text-[#102d5c]">
                Assigned Parcels
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review and verify parcels for this project.
              </p>
            </div>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search parcel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 md:w-72"
              />

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="border-b bg-blue-50/50 text-left text-sm text-gray-600">

                  <th className="px-5 py-4">
                    Parcel ID
                  </th>

                  <th className="px-5 py-4">
                    Landowner
                  </th>

                  <th className="px-5 py-4">
                    Location
                  </th>

                  <th className="px-5 py-4">
                    Area
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Risk
                  </th>

                  <th className="px-5 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {parcels.map((parcel) => (

                  <tr
                    key={parcel.id}
                    className="border-b border-gray-100 hover:bg-blue-50/30"
                  >

                    <td className="px-5 py-5 font-bold text-blue-600">
                      {parcel.id}
                    </td>

                    <td className="px-5 py-5 text-sm font-medium text-gray-700">
                      {parcel.owner}
                    </td>

                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2">

                        <MapPin
                          size={17}
                          className="text-blue-600"
                        />

                        <div>

                          <p className="text-sm font-medium text-gray-700">
                            {parcel.location}
                          </p>

                          <p className="text-xs text-gray-400">
                            {selectedProject.district}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-5 text-sm text-gray-600">
                      {parcel.area}
                    </td>

                    <td className="px-5 py-5">
                      <StatusBadge status={parcel.status} />
                    </td>

                    <td className="px-5 py-5">
                      <RiskBadge risk={parcel.risk} />
                    </td>

                    <td className="px-5 py-5">

                      <div className="flex gap-2">

                        <button
                          className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={15} />
                          View
                        </button>

                        {parcel.status !== "Verified" && (
                          <button
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Verify
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="border-t px-5 py-4 text-sm text-gray-500">
            Showing {parcels.length} of {total} parcels
          </div>

        </div>

      </div>
    );
  }

  /*
   * ============================================
   * PROJECT LIST VIEW
   * ============================================
   */

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <h1 className="text-2xl font-bold text-[#102d5c]">
            Parcel Verification
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Select a project to view and verify its parcels.
          </p>

        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
          {projects.length} Projects
        </div>

      </div>

      {/* SEARCH */}

      <div className="relative w-full md:w-96">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
        />

      </div>

      {/* PROJECT CARDS */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {filteredProjects.map((project) => {

          const verified = project.parcels.filter(
            (p) => p.status === "Verified"
          ).length;

          const pending = project.parcels.filter(
            (p) => p.status === "Pending"
          ).length;

          const progress =
            (verified / project.parcels.length) * 100;

          return (

            <div
              key={project.id}
              className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* PROJECT TOP */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Folder size={27} />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-blue-600">
                      {project.id}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-[#102d5c]">
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

              <div className="mt-6 flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Project Status
                </span>

                <StatusBadge status={project.status} />

              </div>

              {/* PARCEL COUNT */}

              <div className="mt-4 flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Total Parcels
                </span>

                <span className="text-lg font-bold text-[#102d5c]">
                  {project.parcels.length}
                </span>

              </div>

              {/* PROGRESS */}

              <div className="mt-4">

                <div className="mb-2 flex justify-between text-sm">

                  <span className="text-gray-500">
                    Verification Progress
                  </span>

                  <span className="font-semibold text-blue-600">
                    {verified}/{project.parcels.length}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* PENDING */}

              <div className="mt-4 text-sm text-gray-500">

                <span className="font-semibold text-yellow-600">
                  {pending}
                </span>{" "}
                parcels pending verification

              </div>

              {/* OPEN */}

              <div className="mt-5 border-t pt-4">

                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setSearch("");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Open Project
                  <ArrowRight size={17} />
                </button>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}


/* ============================================
   STAT CARD
============================================ */

function StatCard({ title, value, icon }) {

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#102d5c]">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ============================================
   STATUS BADGE
============================================ */

function StatusBadge({ status }) {

  const styles = {
    "In Progress": "bg-blue-100 text-blue-700",
    Verification: "bg-yellow-100 text-yellow-700",
    "Data Collection": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",

    Pending: "bg-yellow-100 text-yellow-700",
    Verified: "bg-green-100 text-green-700",
    "Under Review": "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}


/* ============================================
   RISK BADGE
============================================ */

function RiskBadge({ risk }) {

  const styles = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${styles[risk]}`}
    >
      {risk}
    </span>
  );
}