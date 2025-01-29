import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  ArrowUpDown,
  Check,
  CheckCheck,
  Clock,
  MoreHorizontal,
} from "lucide-react";

import { Donation } from "@/routes/_auth/donations";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { Response } from "@/auth";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = (
  setData: (data: Donation[]) => void,
  data: Donation[]
) => {
  // TODO: Please uncomment me :P
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
      accessorKey: "donation_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("donationsTable.donationID")}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("donation_id")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "donator.name",
      header: t("donationsTable.donatorName"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.donator.name}</div>
      ),
    },
    {
      accessorKey: "resource.name",
      header: t("donationsTable.resource.name"),
      cell: ({ row }) => (
        <div className="truncate text-right font-medium">
          {row.original.resource.name}
        </div>
      ),
    },
    {
      accessorKey: "resource.quantity",
      header: t("donationsTable.resource.quantity"),
      cell: ({ row }) => (
        <div className="truncate text-right font-medium">
          {row.original.resource.quantity}
        </div>
      ),
    },
    {
      accessorKey: t("donationsTable.status"),
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
        row.original.status === "PENDING" ? (
          <div className="inline-flex items-center gap-1 text-gray-400">
            <Clock size="14" />
            Pending
          </div>
        ) : row.original.status === "ACCEPTED" ? (
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
      accessorKey: "donationDate",
      header: ({ column }) => {
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("donationsTable.donationDate")}
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.donationDate);

        if (date instanceof Date && !isNaN(date.getTime())) {
          const formatted = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return <div className="text-right font-medium">{formatted}</div>;
        }

        return <div className="text-right font-medium">-</div>;
      },
    },
    {
      accessorKey: "acceptDate",
      header: ({ column }) => {
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("donationsTable.acceptDate")}
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const date = row.original.acceptDate
          ? new Date(row.original.acceptDate)
          : null;

        if (date instanceof Date && !isNaN(date.getTime())) {
          const formatted = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return <div className="text-right font-medium">{formatted}</div>;
        }

        return <div className="text-right font-medium">-</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const donation = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("donationsTable.openMenu")}</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(donation.donation_id.toString())
                }
              >
                {t("donationsTable.copyDonationID")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  const token = localStorage.getItem("auth.token");

                  try {
                    const response = await api<Response>(
                      `/api/donation/${donation.donation_id}`,
                      "DELETE",
                      undefined,
                      token!
                    );

                    if (response.status === "error") {
                      throw new Error("Delete failed");
                    }

                    const deleted = data.filter(
                      (donation) =>
                        donation.donation_id !== donation.donation_id
                    );
                    setData(deleted);
                  } catch (error) {
                    console.error("Delete failed", error);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ] as ColumnDef<Donation>[];
};
