import {
  ArrowUpDown,
  Check,
  CheckCheck,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Raport = {
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
};

export const columns = () => {
  const { t } = useTranslation();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Report ID
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
      enableHiding: false,
    },
    {
      accessorKey: "victim",
      header: "Victim",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("victim")}</div>
      ),
    },
    {
      accessorKey: "charity",
      header: "Charity",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("charity")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) =>
        row.getValue("status") === "pending" ? (
          <div className="inline-flex items-center gap-1 text-gray-400">
            <Clock size="14" />
            Pending
          </div>
        ) : row.getValue("status") === "accepted" ? (
          <div className="inline-flex items-center gap-1 text-lime-400">
            <Check size="14" />
            Accepted
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 text-green-600">
            <CheckCheck size="14" />
            Completed
          </div>
        ),
    },
    {
      accessorKey: "report_date",
      header: ({ column }) => {
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Report date
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("report_date"));
        const formatted = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy raport ID
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={editRow({ row })}>Edit</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ] as ColumnDef<Raport>[];
};
