"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Map,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function ParcelVerification({ params }) {
  const { id } = React.use(params);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          href={`/roles/LandAcqOfficer/my-project/${id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
              <Map className="h-7 w-7 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                PARCEL VERIFICATION
              </p>

              <h1 className="text-2xl font-bold text-slate-900">
                Project #{id}
              </h1>

              <p className="text-sm text-slate-500">
                Verify parcels submitted by the Project Officer
              </p>
            </div>

          </div>
        </div>

        {/* Verification Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Parcel Verification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the land parcels associated with this project.
            </p>
          </div>

          {/* Example Parcel */}
          <div className="p-6">

            <div className="rounded-xl border border-slate-200 p-5">

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Parcel ID
                  </p>

                  <p className="mt-1 font-semibold">
                    P-001
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Survey Number
                  </p>

                  <p className="mt-1 font-semibold">
                    123/1
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Land Area
                  </p>

                  <p className="mt-1 font-semibold">
                    2.45 Hectares
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Land Owner
                  </p>

                  <p className="mt-1 font-semibold">
                    Rajesh Kumar
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Village
                  </p>

                  <p className="mt-1 font-semibold">
                    Modinagar
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Pending Verification
                  </span>
                </div>

              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-5">

                <button className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  Verify Parcel
                </button>

                <button className="flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-semibold text-red-600 hover:bg-red-100">
                  <XCircle className="h-5 w-5" />
                  Reject Parcel
                </button>

                <button className="flex items-center gap-2 rounded-xl bg-amber-50 px-5 py-3 font-semibold text-amber-700 hover:bg-amber-100">
                  <AlertTriangle className="h-5 w-5" />
                  Raise Issue
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}