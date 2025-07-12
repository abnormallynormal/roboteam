"use client";
import Navbar from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { columns, Response } from "./columns";
import { DataTable } from "./data-table";
import { useState } from "react";
export default function Forms() {
  const [responses, setResponses] = useState<Response[]>([]);
  return (
    <div>
      <Navbar />
      <div className="px-24 py-8">
        <div className="text-3xl font-bold my-2">Forms</div>
        <div className="mb-8">
          Track expenses, manage budget, and monitor financial health.
        </div>
        <div className="text-2xl font-semibold mb-4">Manage forms</div>
        <div className="grid grid-cols-[1fr_4fr] gap-6">
          <Card>
            <div className="font-semibold mx-4 text-lg">Select form</div>
          </Card>
          <Card>
            <div className="font-semibold text-lg mx-4">Responses</div>
            <div className="mx-4">
              <DataTable
                columns={columns(() => {})}
                data={responses}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
