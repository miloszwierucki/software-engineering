import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DataTable } from "@/components/other/reports/data-table";
import { columns } from "@/components/other/reports/column";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_auth/reports")({
  component: ReportRoute,
});

interface IReport {
  id: string;
  victim: string;
  charity: string;
  category: string;
  location: string;
  status: "pending" | "accepted" | "completed";
  report_date: string; // Format: YYYY-MM-DD
  accept_date: string; // Format: YYYY-MM-DD
  completion_date: string; // Format: YYYY-MM-DD
  resources: any[]; // Adjust type if specific structure is known
  volunteers: any[]; // Adjust type if specific structure is known
}

const reports: IReport[] = [
  {
    id: "1000",
    victim: "Ewa Zielińska",
    charity: "Animal Welfare Foundation",
    category: "Animals",
    location: "Wrocław",
    status: "pending",
    report_date: "2023-08-16",
    accept_date: "2023-08-25",
    completion_date: "2023-10-20",
    resources: [],
    volunteers: [],
  },
  {
    id: "1001",
    victim: "John Doe",
    charity: "Health for All",
    category: "Health",
    location: "Kraków",
    status: "accepted",
    report_date: "2023-08-09",
    accept_date: "2023-08-21",
    completion_date: "2023-08-25",
    resources: [],
    volunteers: [],
  },
  {
    id: "1002",
    victim: "Anna Black",
    charity: "Education Matters",
    category: "Education",
    location: "Kraków",
    status: "pending",
    report_date: "2023-06-13",
    accept_date: "2023-06-29",
    completion_date: "2023-08-13",
    resources: [],
    volunteers: [],
  },
  {
    id: "1003",
    victim: "Krzysztof Przyczepa",
    charity: "Education Matters",
    category: "Education",
    location: "Poznań",
    status: "completed",
    report_date: "2023-07-07",
    accept_date: "2023-07-23",
    completion_date: "2023-08-12",
    resources: [],
    volunteers: [],
  },
  {
    id: "1004",
    victim: "Magda Kowalska",
    charity: "Education Matters",
    category: "Education",
    location: "Kraków",
    status: "accepted",
    report_date: "2023-03-12",
    accept_date: "2023-03-19",
    completion_date: "2023-05-05",
    resources: [],
    volunteers: [],
  },
  {
    id: "1005",
    victim: "Jane Smith",
    charity: "Community Help Center",
    category: "Community",
    location: "Łódź",
    status: "completed",
    report_date: "2023-02-17",
    accept_date: "2023-03-01",
    completion_date: "2023-03-15",
    resources: [],
    volunteers: [],
  },
  {
    id: "1006",
    victim: "Robert Lewandowski",
    charity: "Animal Welfare Foundation",
    category: "Animals",
    location: "Kraków",
    status: "pending",
    report_date: "2023-04-12",
    accept_date: "2023-04-15",
    completion_date: "2023-06-01",
    resources: [],
    volunteers: [],
  },
  {
    id: "1007",
    victim: "Michał Nowak",
    charity: "Health for All",
    category: "Health",
    location: "Gdańsk",
    status: "accepted",
    report_date: "2023-07-22",
    accept_date: "2023-07-30",
    completion_date: "2023-08-22",
    resources: [],
    volunteers: [],
  },
  {
    id: "1008",
    victim: "Anna Black",
    charity: "Green Earth Initiative",
    category: "Environment",
    location: "Warszawa",
    status: "completed",
    report_date: "2023-05-05",
    accept_date: "2023-05-15",
    completion_date: "2023-06-05",
    resources: [],
    volunteers: [],
  },
  {
    id: "1009",
    victim: "Ewa Zielińska",
    charity: "Education Matters",
    category: "Education",
    location: "Poznań",
    status: "pending",
    report_date: "2023-09-01",
    accept_date: "2023-09-12",
    completion_date: "2023-10-10",
    resources: [],
    volunteers: [],
  },
  {
    id: "1010",
    victim: "Magda Kowalska",
    charity: "Community Help Center",
    category: "Community",
    location: "Łódź",
    status: "accepted",
    report_date: "2023-08-25",
    accept_date: "2023-09-05",
    completion_date: "2023-09-25",
    resources: [],
    volunteers: [],
  },
];

function ReportRoute() {
  const [data, setData] = useState<IReport[]>(reports);

  const handleAddNewReport = () => {
    setData([
      ...data,
      {
        id: "1011",
        victim: "Anna Black",
        charity: "Robert Lewandowski",
        category: "Education",
        location: "Kraków",
        status: "pending",
        report_date: "2023-06-13",
        accept_date: "2023-06-29",
        completion_date: "2023-08-13",
        resources: [],
        volunteers: [],
      },
    ]);
  };

  return (
    <>
      <div className="bg-panel-gradient inline-flex w-full items-center justify-between gap-2 bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">Reports</h1>
          <p className="ml-1 font-light text-gray-600">
            All reports from your ass
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add new report</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new report</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  defaultValue="@peduarte"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddNewReport}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mx-auto w-full px-4">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
