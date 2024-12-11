import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DataTable } from "@/components/other/donations/data-table";
import { columns } from "@/components/other/donations/column";
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

export const Route = createFileRoute("/_auth/donations")({
  component: DonationsRoute,
});

interface Donation {
  donation_id: number;
  donator: {
    userId: number;
    name: string;
  };
  status: "PENDING" | "ACCEPTED" | "COMPLETED";
  donationDate: string; // ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  acceptDate: string; // ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  resources: {
    resourceId: number;
    name: string;
    quantity: number;
  }[];
}

const donations: Donation[] = [
  {
    donation_id: 1,
    donator: { userId: 4, name: "Ewa Zielińska" },
    status: "COMPLETED",
    donationDate: "2023-11-06T00:00:00.000Z",
    acceptDate: "2023-11-24T00:00:00.000Z",
    resources: [
      { resourceId: 3, name: "Medical Supplies", quantity: 10 },
      { resourceId: 1, name: "Blanket", quantity: 5 },
    ],
  },
  {
    donation_id: 2,
    donator: { userId: 2, name: "Anna Black" },
    status: "PENDING",
    donationDate: "2023-05-23T00:00:00.000Z",
    acceptDate: "2023-05-26T00:00:00.000Z",
    resources: [
      { resourceId: 2, name: "Canned Food", quantity: 15 },
      { resourceId: 3, name: "Medical Supplies", quantity: 7 },
    ],
  },
  {
    donation_id: 3,
    donator: { userId: 5, name: "Michał Nowak" },
    status: "COMPLETED",
    donationDate: "2023-07-03T00:00:00.000Z",
    acceptDate: "2023-07-09T00:00:00.000Z",
    resources: [{ resourceId: 3, name: "Medical Supplies", quantity: 12 }],
  },
  {
    donation_id: 4,
    donator: { userId: 3, name: "Krzysztof Przyczepa" },
    status: "ACCEPTED",
    donationDate: "2023-11-26T00:00:00.000Z",
    acceptDate: "2023-12-08T00:00:00.000Z",
    resources: [
      { resourceId: 1, name: "Blanket", quantity: 20 },
      { resourceId: 2, name: "Canned Food", quantity: 30 },
    ],
  },
  {
    donation_id: 5,
    donator: { userId: 2, name: "Anna Black" },
    status: "COMPLETED",
    donationDate: "2023-10-21T00:00:00.000Z",
    acceptDate: "2023-11-19T00:00:00.000Z",
    resources: [{ resourceId: 2, name: "Canned Food", quantity: 18 }],
  },
  {
    donation_id: 6,
    donator: { userId: 1, name: "Robert Lewandowski" },
    status: "PENDING",
    donationDate: "2023-03-12T00:00:00.000Z",
    acceptDate: "2023-03-20T00:00:00.000Z",
    resources: [
      { resourceId: 1, name: "Blanket", quantity: 8 },
      { resourceId: 2, name: "Canned Food", quantity: 25 },
    ],
  },
  {
    donation_id: 7,
    donator: { userId: 4, name: "Ewa Zielińska" },
    status: "ACCEPTED",
    donationDate: "2023-04-15T00:00:00.000Z",
    acceptDate: "2023-05-01T00:00:00.000Z",
    resources: [{ resourceId: 3, name: "Medical Supplies", quantity: 10 }],
  },
  {
    donation_id: 8,
    donator: { userId: 3, name: "Krzysztof Przyczepa" },
    status: "COMPLETED",
    donationDate: "2023-09-10T00:00:00.000Z",
    acceptDate: "2023-09-20T00:00:00.000Z",
    resources: [
      { resourceId: 2, name: "Canned Food", quantity: 12 },
      { resourceId: 3, name: "Medical Supplies", quantity: 6 },
    ],
  },
  {
    donation_id: 9,
    donator: { userId: 2, name: "Anna Black" },
    status: "PENDING",
    donationDate: "2023-02-22T00:00:00.000Z",
    acceptDate: "2023-03-01T00:00:00.000Z",
    resources: [{ resourceId: 1, name: "Blanket", quantity: 4 }],
  },
  {
    donation_id: 10,
    donator: { userId: 1, name: "Robert Lewandowski" },
    status: "ACCEPTED",
    donationDate: "2023-08-18T00:00:00.000Z",
    acceptDate: "2023-08-25T00:00:00.000Z",
    resources: [
      { resourceId: 2, name: "Canned Food", quantity: 22 },
      { resourceId: 1, name: "Blanket", quantity: 14 },
    ],
  },
  {
    donation_id: 11,
    donator: { userId: 5, name: "Michał Nowak" },
    status: "COMPLETED",
    donationDate: "2023-07-05T00:00:00.000Z",
    acceptDate: "2023-07-15T00:00:00.000Z",
    resources: [{ resourceId: 3, name: "Medical Supplies", quantity: 9 }],
  },
  {
    donation_id: 12,
    donator: { userId: 4, name: "Ewa Zielińska" },
    status: "PENDING",
    donationDate: "2023-01-20T00:00:00.000Z",
    acceptDate: "2023-01-28T00:00:00.000Z",
    resources: [
      { resourceId: 1, name: "Blanket", quantity: 7 },
      { resourceId: 3, name: "Medical Supplies", quantity: 4 },
    ],
  },
  {
    donation_id: 13,
    donator: { userId: 3, name: "Krzysztof Przyczepa" },
    status: "ACCEPTED",
    donationDate: "2023-05-25T00:00:00.000Z",
    acceptDate: "2023-06-10T00:00:00.000Z",
    resources: [{ resourceId: 2, name: "Canned Food", quantity: 15 }],
  },
  {
    donation_id: 14,
    donator: { userId: 2, name: "Anna Black" },
    status: "COMPLETED",
    donationDate: "2023-12-01T00:00:00.000Z",
    acceptDate: "2023-12-10T00:00:00.000Z",
    resources: [{ resourceId: 3, name: "Medical Supplies", quantity: 5 }],
  },
  {
    donation_id: 15,
    donator: { userId: 1, name: "Robert Lewandowski" },
    status: "PENDING",
    donationDate: "2023-11-01T00:00:00.000Z",
    acceptDate: "2023-11-07T00:00:00.000Z",
    resources: [
      { resourceId: 1, name: "Blanket", quantity: 10 },
      { resourceId: 2, name: "Canned Food", quantity: 20 },
    ],
  },
];

function DonationsRoute() {
  const [data, setData] = useState<Donation[]>(donations);

  const handleAddNewReport = () => {
    setData([
      ...data,
      {
        donation_id: 1,
        donator: { userId: 4, name: "Ewa Zielińska" },
        status: "COMPLETED",
        donationDate: "2023-11-06T00:00:00.000Z",
        acceptDate: "2023-11-24T00:00:00.000Z",
        resources: [
          { resourceId: 3, name: "Medical Supplies", quantity: 10 },
          { resourceId: 1, name: "Blanket", quantity: 5 },
        ],
      },
    ]);
  };

  return (
    <>
      <div className="bg-panel-gradient inline-flex w-full items-center justify-between gap-2 bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">Dontarinda</h1>
          <p className="ml-1 font-light text-gray-600">
            All rfsdgfhghgjeports from your ass
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add new donation</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new donation</DialogTitle>
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
        <DataTable columns={columns()} data={data} />
      </div>
    </>
  );
}
