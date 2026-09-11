"use client";

import React, { useState } from "react";
// @ts-ignore
import "./page.css";
import {
  MapPin,
  FileText,
  Building2,
  LandPlot,
  ChevronLeft,
  ChevronRight,
  Upload,
  Trash2,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Header } from "../../../component/layout/index";
const steps = [
  {
    id: 1,
    title: "Project Information",
    icon: Building2,
  },
  {
    id: 2,
    title: "Administrative Location",
    icon: MapPin,
  },
  {
    id: 3,
    title: "Project GIS Location",
    icon: LandPlot,
  },
  {
    id: 4,
    title: "Land Requirement",
    icon: LandPlot,
  },
  {
    id: 5,
    title: "Documents & Review",
    icon: FileText,
  },
];

const projectTypes = [
  "Highway",
  "Railway",
  "Metro",
  "Road",
  "Irrigation",
  "Industrial",
  "Other",
];

const units = ["Hectare", "Acre"];

const documentTypes = [
  "Project Proposal",
  "Project Plan / Route",
  "Land Requirement Document",
  "Approval / Reference Document",
  "Other",
];

function SectionHeader({ icon, title, description }) {
  return (
    <div className="border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Required() {
  return <span className="text-red-500">*</span>;
}

function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    projectType: "",
    description: "",
    department: "",

    state: "Delhi",
    district: "Delhi",
    tehsil: "",
    villages: "",

    locationType: "linear",
    latitude: "",
    longitude: "",
    routeLength: "",
    calculatedArea: "",

    requiredLandArea: "",
    unit: "Hectare",
    acquisitionRequirement: "",
    purpose: "",
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [otherType, setOtherType] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
        if (!formData.projectId.trim()) {
        newErrors.projectId = "Project ID is required";
      }
      if (!formData.projectName.trim()) {
        newErrors.projectName = "Project name is required";
      }

      if (!formData.projectType) {
        newErrors.projectType = "Please select project type";
      }
    }

    if (currentStep === 2) {
      if (!formData.state) {
        newErrors.state = "State is required";
      }

      if (!formData.district) {
        newErrors.district = "District is required";
      }
    }

    if (currentStep === 3) {
      if (!formData.latitude || !formData.longitude) {
        newErrors.location = "Please select the project location on the map";
      }
    }

    if (currentStep === 4) {
      if (!formData.requiredLandArea) {
        newErrors.requiredLandArea = "Required land area is required";
      }

      if (!formData.purpose.trim()) {
        newErrors.purpose = "Purpose of land requirement is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);

    const newDocuments = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      type: "Other",
      remark: "",
    }));

    setDocuments((prev) => [...prev, ...newDocuments]);
  };

  const updateDocument = (id, field, value) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              [field]: value,
            }
          : doc
      )
    );
  };

  const deleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateStep()) return;

    const projectPayload = {
      ...formData,
      documents,
      status: "Pending LAO Verification",
    };

    console.log("BHOOMI-AI Project Payload:", projectPayload);

    alert("Project created successfully.");
  };

  const saveDraft = () => {
    const draft = {
      ...formData,
      documents,
      status: "Draft",
    };

    console.log("Saved Draft:", draft);

    alert("Project draft saved successfully.");
  };

  return (
    <>
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header title="Create Project" />
      <div className="  bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Create Project
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new land acquisition project and provide its initial project and location information.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Project Officer</span>
              <span>•</span>
              <span>New Project</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className=" bg-white">
        <div className="mx-auto border border-white shadow-lg rounded-full max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-4">
          <div className="flex min-w-175 items-center py-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id < currentStep) {
                        setCurrentStep(step.id);
                      }
                    }}
                    className="flex items-center gap-3 text-left"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                        isCompleted
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white text-slate-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>

                    <div className="hidden sm:block">
                      <p
                        className={`text-xs font-medium ${
                          isActive
                            ? "text-blue-700"
                            : isCompleted
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }`}
                      >
                        STEP {step.id}
                      </p>

                      <p
                        className={`text-xs font-medium ${
                          isActive ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </button>

                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-px flex-1 ${
                        currentStep > step.id ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {currentStep === 1 && (
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                icon={<Building2 className="h-5 w-5" />}
                title="Project Information"
                description="Enter the basic information of the project."
              />

              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  <label className="form-label">
                    Project ID <Required />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BH-2026-AUTO"
                    value={formData.projectId}
                    onChange={(e) => updateField("projectId", e.target.value)}
                    className={`form-input ${
                      errors.projectId ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage message={errors.projectId} />
                </div>

                <div>
                  <label className="form-label">
                    Project Name <Required />
                  </label>

                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => updateField("projectName", e.target.value)}
                    placeholder="e.g. Delhi–Meerut Highway Expansion"
                    className={`form-input ${
                      errors.projectName ? "border-red-500" : ""
                    }`}
                  />

                  <ErrorMessage message={errors.projectName} />
                </div>

                <div>
                  <label className="form-label">
                    Project Type <Required />
                  </label>

                  <select
                    value={formData.projectType}
                    onChange={(e) => updateField("projectType", e.target.value)}
                    className={`form-input ${
                      errors.projectType ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {formData.projectType === "Other" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Enter the project type"
                        value={otherType}
                        onChange={(e) => setOtherType(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  )}

                  <ErrorMessage message={errors.projectType} />
                </div>

                <div>
                  <label className="form-label">Department / Agency</label>

                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    placeholder="e.g. PWD / NHAI / State Department"
                    className="form-input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Project Description</label>

                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Briefly describe the project, its scope and objective..."
                    className="form-input resize-none"
                  />

                  <p className="form-help">
                    Provide a short description that helps the LAO understand the project context.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                icon={<MapPin className="h-5 w-5" />}
                title="Administrative Location"
                description="Specify the administrative area covered by the project."
              />

              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  <label className="form-label">
                    State <Required />
                  </label>

                  <select
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="form-input"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    District <Required />
                  </label>

                  <select
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    className="form-input"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Meerut">Meerut</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Tehsil / Taluk</label>

                  <input
                    type="text"
                    value={formData.tehsil}
                    onChange={(e) => updateField("tehsil", e.target.value)}
                    placeholder="Enter tehsil / taluk"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Village(s)</label>

                  <input
                    type="text"
                    value={formData.villages}
                    onChange={(e) => updateField("villages", e.target.value)}
                    placeholder="e.g. Village A, Village B"
                    className="form-input"
                  />

                  <p className="form-help">
                    Multiple villages can be entered if the project spans multiple villages.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                icon={<MapPin className="h-5 w-5" />}
                title="Project Location / GIS"
                description="Define the project area or route using the interactive map."
              />

              <div className="space-y-6 p-6">
                <div>
                  <label className="form-label">
                    Project Location Type <Required />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label
                      className={`cursor-pointer rounded-lg border p-4 ${
                        formData.locationType === "area"
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        value="area"
                        checked={formData.locationType === "area"}
                        onChange={(e) => updateField("locationType", e.target.value)}
                        className="sr-only"
                      />

                      <div className="flex items-start gap-3">
                        <LandPlot className="mt-0.5 h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-900">Area Project</p>
                          <p className="mt-1 text-sm text-slate-500">
                            Draw a polygon to define the project area.
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer rounded-lg border p-4 ${
                        formData.locationType === "linear"
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        value="linear"
                        checked={formData.locationType === "linear"}
                        onChange={(e) => updateField("locationType", e.target.value)}
                        className="sr-only"
                      />

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-900">
                            Linear / Corridor Project
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Draw a route or polyline for roads, railways, pipelines, etc.
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* GIS Map Placeholder */}
                <div>
                  <label className="form-label">
                    Project Map Location <Required />
                  </label>

                  <div className="relative h-105 overflow-hidden rounded-xl border border-slate-300 bg-slate-100">
                    <div className="flex h-full flex-col items-center justify-center text-center p-4">
                      <MapPin className="h-10 w-10 text-slate-400" />
                      <p className="mt-3 font-medium text-slate-700">
                        Interactive GIS Map
                      </p>
                      <p className="mt-1 max-w-md text-sm text-slate-500">
                        Integrate your Leaflet / React-Leaflet map here.
                        {formData.locationType === "area"
                          ? " Draw a polygon for the project area."
                          : " Draw a route/polyline for the project corridor."}
                      </p>
                      <button
                        type="button"
                        className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                        onClick={() => {
                          updateField("latitude", "28.6139");
                          updateField("longitude", "77.2090");
                          updateField(
                            formData.locationType === "area" ? "calculatedArea" : "routeLength",
                            "15.5"
                          );
                        }}
                      >
                        Use Demo Location
                      </button>
                    </div>
                  </div>

                  <ErrorMessage message={errors.location} />
                </div>

                {/* Coordinates */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="form-label">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      readOnly
                      placeholder="Auto captured from map"
                      className="form-input bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="form-label">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      readOnly
                      placeholder="Auto captured from map"
                      className="form-input bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      {formData.locationType === "area"
                        ? "Calculated Area (Ha)"
                        : "Route Length (km)"}
                    </label>
                    <input
                      type="text"
                      value={
                        formData.locationType === "area"
                          ? formData.calculatedArea
                          : formData.routeLength
                      }
                      readOnly
                      placeholder="Calculated from map"
                      className="form-input bg-slate-50"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                  <strong>GIS note:</strong> The geometry entered here represents the project boundary or route. It does not create or modify official cadastral parcel boundaries.
                </div>
              </div>
            </section>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                icon={<LandPlot className="h-5 w-5" />}
                title="Land Requirement"
                description="Provide the estimated land requirement for the project."
              />

              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  <label className="form-label">
                    Required Land Area <Required />
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.requiredLandArea}
                    onChange={(e) => updateField("requiredLandArea", e.target.value)}
                    placeholder="Enter required land area"
                    className={`form-input ${
                      errors.requiredLandArea ? "border-red-500" : ""
                    }`}
                  />

                  <ErrorMessage message={errors.requiredLandArea} />
                </div>

                <div>
                  <label className="form-label">
                    Unit <Required />
                  </label>

                  <select
                    value={formData.unit}
                    onChange={(e) => updateField("unit", e.target.value)}
                    className="form-input"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Estimated Acquisition Requirement</label>

                  <input
                    type="text"
                    value={formData.acquisitionRequirement}
                    onChange={(e) => updateField("acquisitionRequirement", e.target.value)}
                    placeholder="e.g. Approx. 125 hectares"
                    className="form-input"
                  />

                  <p className="form-help">
                    This is an initial project estimate. Actual parcels will be verified by the LAO.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">
                    Purpose of Land Requirement <Required />
                  </label>

                  <textarea
                    rows={5}
                    value={formData.purpose}
                    onChange={(e) => updateField("purpose", e.target.value)}
                    placeholder="Explain why the land is required for the project..."
                    className={`form-input resize-none ${
                      errors.purpose ? "border-red-500" : ""
                    }`}
                  />

                  <ErrorMessage message={errors.purpose} />
                </div>

                <div className="md:col-span-2 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                  <strong>Important:</strong> Land requirement entered by the Project Officer is preliminary project information. Parcel verification, ownership, compensation, legal disputes and acquisition case details are maintained by the LAO.
                </div>
              </div>
            </section>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <section className="space-y-6">
              {/* Documents Upload */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  icon={<FileText className="h-5 w-5" />}
                  title="Project Documents"
                  description="Upload supporting project documents."
                />

                <div className="p-6">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:bg-slate-100 transition-colors">
                    <Upload className="h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Upload project documents
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      PDF, DOC, DOCX, XLS, XLSX up to 10 MB per file
                    </p>
                    <span className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                      Choose Files
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {documents.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {documents.map((document) => (
                        <div
                          key={document.id}
                          className="rounded-lg border border-slate-200 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="rounded-lg bg-slate-100 p-2">
                                <FileText className="h-5 w-5 text-slate-600" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-800">
                                  {document.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {(document.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteDocument(document.id)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="form-label">Document Type</label>
                              <select
                                value={document.type}
                                onChange={(e) =>
                                  updateDocument(document.id, "type", e.target.value)
                                }
                                className="form-input"
                              >
                                {documentTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="form-label">Remark</label>
                              <input
                                type="text"
                                value={document.remark}
                                onChange={(e) =>
                                  updateDocument(document.id, "remark", e.target.value)
                                }
                                placeholder="Add optional remarks..."
                                className="form-input"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Review Summary */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="Review Information"
                  description="Verify project details before submission."
                />

                <div className="divide-y divide-slate-100 p-6 text-sm">
                  <div className="py-3 grid grid-cols-3">
                    <span className="font-medium text-slate-500">Project Name</span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {formData.projectName || "—"}
                    </span>
                  </div>

                  <div className="py-3 grid grid-cols-3">
                    <span className="font-medium text-slate-500">Project Type</span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {formData.projectType || "—"}
                    </span>
                  </div>

                  <div className="py-3 grid grid-cols-3">
                    <span className="font-medium text-slate-500">Location</span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {formData.district}, {formData.state} | Lat: {formData.latitude}, Lng:{" "}
                      {formData.longitude}
                    </span>
                  </div>

                  <div className="py-3 grid grid-cols-3">
                    <span className="font-medium text-slate-500">Land Requirement</span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {formData.requiredLandArea} {formData.unit}
                    </span>
                  </div>

                  <div className="py-3 grid grid-cols-3">
                    <span className="font-medium text-slate-500">Documents</span>
                    <span className="col-span-2 font-medium text-slate-900">
                      {documents.length} document(s) uploaded
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Submit Project
                </button>
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between gap-4 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 rounded-lg border px-6 py-3 font-medium ${
                currentStep === 1
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>
                Step <span className="font-bold text-slate-900">{currentStep}</span> of{" "}
                <span className="font-bold text-slate-900">{steps.length}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={nextStep}
              disabled={currentStep === steps.length}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium ${
                currentStep === steps.length
                  ? "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
    </>
  );
}
