"use client";

import {
  Folder,
  MapPin,
  FileText,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Clock3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import ParcelVerification from "../parcels/page"

const projects = [
  {
    name: "Delhi-Mumbai Expressway",
    district: "North Delhi",
    status: "In Progress",
    risk: "High",
  },
  {
    name: "Rohini Metro Extension",
    district: "North Delhi",
    status: "Verification",
    risk: "Medium",
  },
  {
    name: "Yamuna Flood Control",
    district: "East Delhi",
    status: "Data Collection",
    risk: "Low",
  },
  {
    name: "Industrial Corridor",
    district: "West Delhi",
    status: "In Progress",
    risk: "Medium",
  },
  {
    name: "Outer Ring Road",
    district: "South Delhi",
    status: "Completed",
    risk: "Low",
  },
];

const activities = [
  {
    text: "Parcel P-1023 marked as verified for Project 1",
    time: "2 hours ago",
    color: "bg-green-500",
  },
  {
    text: "Acquisition data updated for Project 3",
    time: "4 hours ago",
    color: "bg-blue-500",
  },
  {
    text: "Documents missing for Project 5",
    time: "6 hours ago",
    color: "bg-orange-500",
  },
  {
    text: "Risk level changed to High for Project 5",
    time: "7 hours ago",
    color: "bg-red-500",
  },
  {
    text: "New notification: Landowner query for Project 2",
    time: "8 hours ago",
    color: "bg-orange-500",
  },
];


export default function Dashboard() {
  return (
    <div className="space-y-5">

      {/* ================= TOP STAT CARDS ================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Assigned Projects"
          value="12"
          icon={<Folder size={28} />}
          type="blue"
        >
          <span className="font-semibold text-green-600">
            ↑ 2
          </span>{" "}
          <span className="text-blue-500">
            new this week
          </span>
        </StatCard>

        <StatCard
          title="Parcels to be Verified"
          value="86"
          icon={<MapPin size={28} />}
          type="green"
        >
          <span className="font-semibold text-green-600">
            42 verified
          </span>

          <span className="mx-2 text-gray-400">
            •
          </span>

          <span className="text-gray-500">
            44 pending
          </span>
        </StatCard>

        <StatCard
          title="Acquisition Data Pending"
          value="29"
          icon={<FileText size={28} />}
          type="yellow"
        >
          <button className="flex items-center gap-1 font-medium text-blue-600">
            See details
            <ArrowRight size={15} />
          </button>
        </StatCard>

        <StatCard
          title="High Risk Projects"
          value="3"
          icon={<AlertTriangle size={28} />}
          type="red"
        >
          <button className="flex items-center gap-1 font-medium text-red-500">
            Needs attention
            <ArrowRight size={15} />
          </button>
        </StatCard>

      </div>

      {/* ================= PROJECTS + MAP ================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.95fr]">

        {/* ================= PROJECT TABLE ================= */}

        <section className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

            <div className="flex items-center gap-3">

              <ClipboardList
                size={23}
                className="text-blue-600"
              />

              <h2 className="font-bold text-[#102d5c]">
                My Assigned Projects
              </h2>

            </div>

            <button className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50">
              View All Projects
              <ArrowRight size={15} />
            </button>

          </div>

          <div className="overflow-x-auto px-3">

            <table className="w-full min-w-[650px]">

              <thead>
                <tr className="border-b bg-blue-50/50 text-left text-xs text-gray-500">

                  <th className="px-3 py-3">
                    Project Name
                  </th>

                  <th className="px-3 py-3">
                    District
                  </th>

                  <th className="px-3 py-3">
                    Status
                  </th>

                  <th className="px-3 py-3">
                    Risk Level
                  </th>

                  <th className="px-3 py-3">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {projects.map((project) => (

                  <tr
                    key={project.name}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="px-3 py-4 text-sm font-semibold text-gray-700">
                      {project.name}
                    </td>

                    <td className="px-3 py-4 text-sm text-blue-600">
                      {project.district}
                    </td>

                    <td className="px-3 py-4">
                      <StatusBadge
                        status={project.status}
                      />
                    </td>

                    <td className="px-3 py-4">
                      <RiskBadge
                        risk={project.risk}
                      />
                    </td>

                    <td className="px-3 py-4">

                      <button className="flex items-center gap-1 rounded-lg border border-blue-300 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                        View
                        <ArrowRight size={14} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}

          <div className="flex items-center justify-between px-5 py-4 text-xs text-gray-400">

            <span>
              Showing 1-5 of 12 projects
            </span>

            <div className="flex gap-2">

              <button className="rounded-lg border p-2 hover:bg-gray-50">
                <ChevronLeft size={15} />
              </button>

              <button className="rounded-lg bg-blue-600 px-3 py-2 text-white">
                1
              </button>

              <button className="rounded-lg border px-3 py-2">
                2
              </button>

              <button className="rounded-lg border px-3 py-2">
                3
              </button>

              <button className="rounded-lg border p-2">
                <ChevronRight size={15} />
              </button>

            </div>

          </div>

        </section>

        {/* ================= PROJECT MAP ================= */}

        <section className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm">

          <div className="flex items-center justify-between px-2 pb-3">

            <div className="flex items-center gap-3">

              <MapPin
                size={23}
                className="text-blue-600"
              />

              <h2 className="font-bold text-[#102d5c]">
                Project Map
              </h2>

            </div>

            <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
              All Projects
              <ChevronDown size={14} />
            </button>

          </div>

          {/* MAP PLACEHOLDER */}

          <div className="relative h-[330px] overflow-hidden rounded-xl border bg-[#dff0c9]">

            {/* Roads */}

            <div className="absolute left-0 top-12 h-[2px] w-full rotate-6 bg-white" />

            <div className="absolute left-0 top-28 h-[3px] w-full -rotate-3 bg-white" />

            <div className="absolute left-0 top-52 h-[2px] w-full rotate-12 bg-white" />

            <div className="absolute left-20 top-0 h-full w-[2px] rotate-12 bg-white" />

            <div className="absolute left-60 top-0 h-full w-[3px] -rotate-6 bg-white" />

            {/* Locations */}

            <span className="absolute left-[30%] top-[15%] text-sm font-semibold">
              Rohini
            </span>

            <span className="absolute right-[20%] top-[15%] text-sm">
              Shahdara
            </span>

            <span className="absolute bottom-[28%] left-[9%] text-xs">
              Janakpuri
            </span>

            <span className="absolute bottom-[28%] right-[8%] text-xs">
              Noida
            </span>

            <span className="absolute left-[40%] top-[43%] text-2xl font-bold">
              New Delhi
            </span>

            {/* Project Boundary */}

            <div className="absolute left-[28%] top-[20%] h-[62%] w-[48%] rotate-[-8deg] rounded-[45%] border-4 border-blue-600" />

            {/* Markers */}

            <MapMarker
              left="43%"
              top="28%"
              color="bg-red-500"
            />

            <MapMarker
              left="52%"
              top="35%"
              color="bg-orange-500"
            />

            <MapMarker
              left="36%"
              top="38%"
              color="bg-green-500"
            />

            <MapMarker
              left="48%"
              top="56%"
              color="bg-orange-500"
            />

            <MapMarker
              left="35%"
              top="60%"
              color="bg-orange-500"
            />

            <MapMarker
              left="55%"
              top="69%"
              color="bg-green-500"
            />

            {/* Selected Parcel */}

            <div className="absolute left-[44%] top-[42%] h-12 w-14 rotate-12 border-2 border-red-600 bg-red-400/60" />

            {/* Legend */}

            <div className="absolute right-3 top-3 rounded-xl border bg-white p-4 shadow-lg">

              <p className="mb-3 text-xs font-bold">
                Risk Level
              </p>

              <Legend
                color="bg-red-500"
                text="High"
              />

              <Legend
                color="bg-orange-500"
                text="Medium"
              />

              <Legend
                color="bg-green-500"
                text="Low"
              />

              <div className="my-3 border-t" />

              <div className="flex items-center gap-3 text-xs">
                <span className="h-4 w-4 rounded-sm border-2 border-blue-600" />
                Project Boundary
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="h-4 w-4 rounded-sm border-2 border-red-500 bg-red-300" />
                Selected Parcel
              </div>

            </div>

            {/* Zoom */}

            <div className="absolute bottom-3 right-3 overflow-hidden rounded-lg bg-white shadow">

              <button className="block border-b px-3 py-1 text-xl">
                +
              </button>

              <button className="block px-3 py-1 text-xl">
                −
              </button>

            </div>

          </div>

        </section>

      </div>

      {/* ================= RECENT ACTIVITY + QUICK STATS ================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.95fr]">

        {/* RECENT ACTIVITY */}

        <section className="rounded-xl border border-blue-100 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b px-5 py-4">

            <div className="flex items-center gap-3">

              <Clock3
                size={23}
                className="text-blue-600"
              />

              <h2 className="font-bold text-[#102d5c]">
                Recent Activity
              </h2>

            </div>

            <button className="flex items-center gap-1 text-xs font-semibold text-blue-600">
              View All
              <ArrowRight size={14} />
            </button>

          </div>

          {activities.map((activity, index) => (

            <div
              key={index}
              className="flex items-center gap-4 border-b px-5 py-3 last:border-0"
            >

              <span
                className={`h-3 w-3 shrink-0 rounded-full ${activity.color}`}
              />

              <p className="flex-1 text-sm text-blue-600">
                {activity.text}
              </p>

              <span className="whitespace-nowrap text-xs text-gray-400">
                {activity.time}
              </span>

            </div>

          ))}

        </section>

        {/* QUICK STATS */}

        <section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">

          <div className="mb-4 flex items-center gap-3">

            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              📊
            </div>

            <h2 className="font-bold text-[#102d5c]">
              Quick Stats
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <QuickStat
              title="Verified Parcels"
              value="42 / 86"
              percent={49}
              type="green"
              icon={<CheckCircle2 size={20} />}
            />

            <QuickStat
              title="Data Complete"
              value="34 / 86"
              percent={40}
              type="blue"
              icon={<FileText size={20} />}
            />

            <QuickStat
              title="Avg. Delay Risk"
              value="58%"
              percent={58}
              type="red"
              icon={<AlertTriangle size={20} />}
            />

            <QuickStat
              title="On Track Projects"
              value="8 / 12"
              percent={67}
              type="green"
              icon={<CheckCircle2 size={20} />}
            />

          </div>

        </section>

      </div>

    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  icon,
  type,
  children,
}) {
  const styles = {
    blue: {
      border: "border-blue-200",
      bg: "from-white to-blue-50",
      icon: "bg-blue-100 text-blue-600",
    },
    green: {
      border: "border-green-200",
      bg: "from-white to-green-50",
      icon: "bg-green-100 text-green-600",
    },
    yellow: {
      border: "border-yellow-200",
      bg: "from-white to-yellow-50",
      icon: "bg-yellow-100 text-yellow-600",
    },
    red: {
      border: "border-red-200",
      bg: "from-white to-red-50",
      icon: "bg-red-100 text-red-600",
    },
  };

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-4 shadow-sm ${styles[type].border} ${styles[type].bg}`}
    >

      <div className="flex items-center gap-4">

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${styles[type].icon}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-sm font-medium text-gray-700">
            {title}
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#102d5c]">
            {value}
          </h2>

          <div className="mt-1 text-sm">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-blue-100 text-blue-600",
    Verification: "bg-yellow-100 text-yellow-600",
    "Data Collection": "bg-indigo-100 text-indigo-600",
    Completed: "bg-green-100 text-green-600",
  };

  return (
    <span
      className={`rounded-full px-4 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =====================================================
   RISK BADGE
===================================================== */

function RiskBadge({ risk }) {
  const styles = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-green-100 text-green-600",
  };

  return (
    <span
      className={`rounded-full px-4 py-1.5 text-xs font-semibold ${styles[risk]}`}
    >
      {risk}
    </span>
  );
}

/* =====================================================
   MAP MARKER
===================================================== */

function MapMarker({ left, top, color }) {
  return (
    <span
      className={`absolute h-4 w-4 rounded-full border-2 border-white shadow ${color}`}
      style={{
        left,
        top,
      }}
    />
  );
}

/* =====================================================
   MAP LEGEND
===================================================== */

function Legend({ color, text }) {
  return (
    <div className="mb-2 flex items-center gap-3 text-xs">
      <span
        className={`h-3.5 w-3.5 rounded-full ${color}`}
      />
      {text}
    </div>
  );
}

/* =====================================================
   QUICK STAT
===================================================== */

function QuickStat({
  icon,
  title,
  value,
  percent,
  type,
}) {
  const styles = {
    green: {
      icon: "bg-green-100 text-green-600",
      bar: "bg-green-500",
    },
    blue: {
      icon: "bg-blue-100 text-blue-600",
      bar: "bg-blue-600",
    },
    red: {
      icon: "bg-red-100 text-red-500",
      bar: "bg-red-500",
    },
  };

  return (
    <div className="rounded-xl border border-blue-100 p-3">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${styles[type].icon}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-xs text-gray-500">
            {title}
          </p>

          <p className="font-bold text-[#102d5c]">
            {value}
          </p>

        </div>

      </div>

      <div className="mt-3 flex items-center gap-3">

        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">

          <div
            className={`h-full rounded-full ${styles[type].bar}`}
            style={{
              width: `${percent}%`,
            }}
          />

        </div>

        <span className="text-xs font-medium text-blue-600">
          {percent}%
        </span>

      </div>

    </div>
  );
}