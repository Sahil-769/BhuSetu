"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building2,
  FileText,
  LandPlot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Map,
  Users,
  Ruler,
  Briefcase,
  Plus,
} from "lucide-react";

import { PROJECTS } from "../projects-data";

export default function ProjectDetails({ params }) {
  const { id } = React.use(params);

  const project = PROJECTS.find(
    (item) => String(item.id) === String(id)
  );

  const [openSection, setOpenSection] = useState({
    project: true,
    location: true,
    gis: true,
    land: true,
    documents: true,
  });
  const [verificationStatus, setVerificationStatus] = useState(null);
  useEffect(() => {
    if (project) {
      const storageKey = project.projectId || project.id;
      setVerificationStatus(window.localStorage.getItem(`bhoomi-verification:${storageKey}`));
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <AlertTriangle
            className="mx-auto mb-4 text-red-500"
            size={42}
          />

          <h1 className="text-2xl font-bold text-slate-900">
            Project Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            The requested project could not be found.
          </p>

          <Link
            href="/roles/LandAcqOfficer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const toggleSection = (section) => {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /*
   * Convert your Project Officer data into the
   * fields displayed on the LAO page.
   *
   * The fallback values make this work even if
   * your current projects-data.js has fewer fields.
   */

  const projectId = project.id || project.projectId || "BH-2026-AUTO";

  const projectName =
    project.name ||
    project.projectName ||
    "Delhi–Meerut Highway Expansion";

  const projectType =
    project.type ||
    project.projectType ||
    "Linear / Corridor Project";

  const department =
    project.department ||
    project.agency ||
    "NHAI";

  const description =
    project.description ||
    "Expansion and improvement of the highway corridor to improve connectivity and regional infrastructure.";

  const state =
    project.state ||
    project.location?.state ||
    "Delhi";

  const district =
    project.district ||
    project.location?.district ||
    "Delhi";

  const tehsil =
    project.tehsil ||
    project.taluk ||
    project.location?.tehsil ||
    "North-East Delhi";

  const villages =
    project.villages ||
    project.location?.villages ||
    ["Village A", "Village B"];

  const latitude =
    project.latitude ||
    project.gis?.latitude ||
    "28.6139";

  const longitude =
    project.longitude ||
    project.gis?.longitude ||
    "77.2090";

  const routeLength =
    project.routeLength ||
    project.gis?.routeLength ||
    "15.5";

  const landArea =
    project.landArea ||
    project.requiredLandArea ||
    project.land?.requiredArea ||
    "125";

  const landUnit =
    project.landUnit ||
    project.unit ||
    project.land?.unit ||
    "Hectare";

  const landPurpose =
    project.landPurpose ||
    project.purpose ||
    project.land?.purpose ||
    "Land is required for the project infrastructure and associated facilities.";

  const documents =
    project.documents || [
      {
        name: "Project Proposal.pdf",
        type: "PDF",
        size: "2.4 MB",
      },
      {
        name: "Land Requirement Statement.xlsx",
        type: "XLSX",
        size: "1.1 MB",
      },
      {
        name: "Project Map.pdf",
        type: "PDF",
        size: "3.2 MB",
      },
    ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">
          <Link
            href="/roles/LandAcqOfficer/my-project"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Assigned Projects
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

              <div>
                <div className="mb-3 flex items-center gap-3">

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Briefcase size={24} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Project ID
                    </p>

                    <p className="font-bold text-slate-900">
                      {projectId}
                    </p>
                  </div>

                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                  {projectName}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Project received from Project Officer
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  <Clock size={16} />
                  Pending Verification
                </span>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="space-y-5 xl:col-span-2">

            {/* PROJECT INFORMATION */}

            <Section
              icon={<Building2 size={21} />}
              title="Project Information"
              subtitle="Information submitted by the Project Officer"
              open={openSection.project}
              onToggle={() => toggleSection("project")}
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <InfoItem
                  label="Project ID"
                  value={projectId}
                />

                <InfoItem
                  label="Project Name"
                  value={projectName}
                />

                <InfoItem
                  label="Project Type"
                  value={projectType}
                />

                <InfoItem
                  label="Department / Agency"
                  value={department}
                />

                <div className="md:col-span-2">
                  <InfoItem
                    label="Project Description"
                    value={description}
                  />
                </div>

              </div>

            </Section>

            {/* ADMINISTRATIVE LOCATION */}

            <Section
              icon={<MapPin size={21} />}
              title="Administrative Location"
              subtitle="Administrative area covered by the project"
              open={openSection.location}
              onToggle={() => toggleSection("location")}
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <InfoItem
                  label="State"
                  value={state}
                />

                <InfoItem
                  label="District"
                  value={district}
                />

                <InfoItem
                  label="Tehsil / Taluk"
                  value={tehsil}
                />

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Village(s)
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {Array.isArray(villages)
                      ? villages.map((village, index) => (
                          <span
                            key={index}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                          >
                            {village}
                          </span>
                        ))
                      : villages
                          .split(",")
                          .map((village, index) => (
                            <span
                              key={index}
                              className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                            >
                              {village.trim()}
                            </span>
                          ))}
                  </div>
                </div>

              </div>

            </Section>

            {/* GIS */}

            <Section
              icon={<Map size={21} />}
              title="Project GIS Location"
              subtitle="GIS location submitted by the Project Officer"
              open={openSection.gis}
              onToggle={() => toggleSection("gis")}
            >

              <div className="mb-5 flex h-[320px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100">

                <div className="text-center">

                  <MapPin
                    size={48}
                    className="mx-auto mb-3 text-black"
                  />

                  <h3 className="font-semibold text-slate-800">
                    Interactive GIS Map
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Project location and acquisition corridor
                  </p>

                  <Link
                    href={`/roles/LandAcqOfficer/gis?project=${project.id}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white "
                  >
                    <Map size={16} />
                    Open Full Map
                  </Link>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <InfoItem
                  label="Latitude"
                  value={latitude}
                />

                <InfoItem
                  label="Longitude"
                  value={longitude}
                />

                <InfoItem
                  label="Route Length"
                  value={`${routeLength} km`}
                />

              </div>

            </Section>

            {/* LAND REQUIREMENT */}

            <Section
              icon={<LandPlot size={21} />}
              title="Land Requirement"
              subtitle="Initial land requirement submitted by Project Officer"
              open={openSection.land}
              onToggle={() => toggleSection("land")}
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <InfoItem
                  label="Required Land Area"
                  value={`${landArea} ${landUnit}`}
                />

                <InfoItem
                  label="Estimated Acquisition Requirement"
                  value={`Approx. ${landArea} ${landUnit}`}
                />

                <div className="md:col-span-2">
                  <InfoItem
                    label="Purpose of Land Requirement"
                    value={landPurpose}
                  />
                </div>

              </div>

              <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                <AlertTriangle
                  size={20}
                  className="mt-0.5 flex-shrink-0 text-amber-600"
                />

                <div>
                  <p className="font-semibold text-amber-800">
                    LAO Verification Required
                  </p>

                  <p className="mt-1 text-sm leading-6 text-amber-700">
                    The land requirement above is preliminary
                    information submitted by the Project Officer.
                    The LAO must verify actual parcels, ownership,
                    land area and acquisition requirements.
                  </p>
                </div>

              </div>

            </Section>

            {/* DOCUMENTS */}

            <Section
              icon={<FileText size={21} />}
              title="Project Documents"
              subtitle="Supporting documents submitted by the Project Officer"
              open={openSection.documents}
              onToggle={() => toggleSection("documents")}
            >

              <div className="space-y-3">

                {documents.map((document, index) => (

                  <div
                    key={index}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30 md:flex-row md:items-center"
                  >

                    <div className="flex items-center gap-3">

                      <div className="rounded-lg bg-red-50 p-3 text-red-600">
                        <FileText size={21} />
                      </div>

                      <div>

                        <p className="font-medium text-slate-800">
                          {document.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {document.type} • {document.size}
                        </p>

                      </div>

                    </div>

                    <div className="flex gap-2">

                      <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <Eye size={16} />
                        View
                      </button>

                      <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <Download size={16} />
                        Download
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </Section>

          </div>
          



          <div className="space-y-5">

            {/* LAO ACTIONS */}

            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center gap-3">

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    LAO Verification
                  </h3>

                  <p className="text-sm text-slate-500">
                    Actions for this project
                  </p>
                </div>

              </div>

              <div className="space-y-3">

                {verificationStatus === "Verified" ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">
                    <CheckCircle2 size={18} />
                    Verified
                  </div>
                ) : (
                  <Link
                    href={`/roles/LandAcqOfficer/acquisition-cases/${projectId}/verify`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-semibold text-white "
                  >
                    <ShieldCheck size={18} />
                    Start Verification
                  </Link>
                )}

                <Link
                  href={`/roles/LandAcqOfficer/GIS?project=${project.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Map size={18} />
                  View Required Land Map
                </Link>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-semibold text-amber-700 hover:bg-amber-100">
                  <AlertTriangle size={18} />
                  Raise an Issue
                </button>

              </div>

            </div>

            {/* ADD PARCELS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-5 flex flex-nowrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <LandPlot size={23} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Add Parcels</h3>
                    <p className="text-sm text-slate-500">Add land parcels for this project</p>
                  </div>
                </div>
                <Link
                  href={`/roles/LandAcqOfficer/parcels/${projectId}`}
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <Plus size={18} />
                  Add Parcels
                </Link>
              </div>

            </div>

            {/* PROGRESS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h3 className="mb-5 font-bold text-slate-900">
                Verification Progress
              </h3>

              <div className="space-y-5">

                <ProgressItem
                  title="Project Information"
                  status="Received"
                  completed
                />

                <ProgressItem
                  title="Administrative Location"
                  status="Received"
                  completed
                />

                <ProgressItem
                  title="GIS Location"
                  status="Received"
                  completed
                />

                <ProgressItem
                  title="Land Requirement"
                  status="Received"
                  completed
                />

                <ProgressItem
                  title="Documents"
                  status="Pending Verification"
                />

                <ProgressItem
                  title="Parcel Verification"
                  status="Not Started"
                />

              </div>

            </div>

            {/* SUMMARY */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h3 className="mb-5 font-bold text-slate-900">
                Project Summary
              </h3>

              <div className="space-y-4">

                <SummaryItem
                  icon={<Ruler size={18} />}
                  label="Land Required"
                  value={`${landArea} ${landUnit}`}
                />

                <SummaryItem
                  icon={<MapPin size={18} />}
                  label="Route Length"
                  value={`${routeLength} km`}
                />

                <SummaryItem
                  icon={<Users size={18} />}
                  label="Villages"
                  value={String(
                    Array.isArray(villages)
                      ? villages.length
                      : villages.split(",").length
                  )}
                />

                <SummaryItem
                  icon={<FileText size={18} />}
                  label="Documents"
                  value={String(documents.length)}
                />

              </div>

            </div>

            {/* FINAL ACTION */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h3 className="mb-2 font-bold text-slate-900">
                Final Action
              </h3>

              <p className="mb-5 text-sm leading-6 text-slate-500">
                Complete parcel and document verification before
                forwarding the project for further processing.
              </p>

              <div className="space-y-3">

                <button className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100">
                  Return for Correction
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700">
                  Complete & Forward
                  <ArrowRight size={18} />
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({
  icon,
  title,
  subtitle,
  open,
  onToggle,
  children,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-slate-100 p-5 text-left hover:bg-slate-50"
      >

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            {icon}
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

        </div>

        {open ? (
          <ChevronUp size={20} className="text-slate-400" />
        ) : (
          <ChevronDown size={20} className="text-slate-400" />
        )}

      </button>

      {open && (
        <div className="p-5">
          {children}
        </div>
      )}

    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800">
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   PROGRESS
========================================================= */

function ProgressItem({
  title,
  status,
  completed = false,
}) {
  return (
    <div className="flex items-start gap-3">

      {completed ? (
        <CheckCircle2
          size={20}
          className="mt-0.5 flex-shrink-0 text-green-500"
        />
      ) : (
        <Clock
          size={20}
          className="mt-0.5 flex-shrink-0 text-slate-400"
        />
      )}

      <div>
        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p
          className={`text-xs ${
            completed
              ? "text-green-600"
              : "text-slate-400"
          }`}
        >
          {status}
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="text-blue-600">
          {icon}
        </div>

        <span className="text-sm text-slate-500">
          {label}
        </span>

      </div>

      <span className="text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}

function ParcelInput({ label, value, onChange, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      <input
        {...inputProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}