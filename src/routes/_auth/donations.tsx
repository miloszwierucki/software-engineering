import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useTranslation } from "react-i18next";
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

type DonationSearch = {
  new: boolean;
};

export const Route = createFileRoute("/_auth/donations")({
  component: DonationsRoute,
  validateSearch: (search: Record<string, unknown>): DonationSearch => {
    // validate and parse the search params into a typed state
    console.log(search);
    return {
      new: search.new === true,
    };
  },
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
  const { new: createNew } = Route.useSearch();
  const [openDialog, setOpenDialog] = useState(createNew);

  const { t } = useTranslation();

  const [newDonation, setNewDonation] = useState<{
    donatorName: string;
    resources: {
      resourceId: number;
      name: string;
      quantity: number;
    }[];
  }>({
    donatorName: "",
    resources: [],
  });

  const handleAddNewDonation = () => {
    setData([
      ...data,
      {
        donation_id: data.length + 1,
        donator: { userId: 0, name: newDonation.donatorName },
        status: "PENDING",
        donationDate: new Date().toISOString(),
        acceptDate: "",
        resources: newDonation.resources,
      },
    ]);

    setOpenDialog(false);
  };

  return (
    <>
      <div className="bg-panel-gradient inline-flex w-full items-center justify-between gap-2 bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">{t("donationsTable.title")}</h1>
          <p className="ml-1 font-light text-gray-600">
          {t("donationsTable.subtitle")}
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">{t("donationsTable.addDonationButton")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("donationsTable.popup.title")}</DialogTitle>
              <DialogDescription>
              {t("donationsTable.popup.subtitle")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="donator" className="text-right">
                {t("donationsTable.popup.donator")}
                </Label>
                <Input
                  id="donator"
                  placeholder="Pedro Duarte"
                  className="col-span-3"
                  onChange={(event) =>
                    setNewDonation((prev) => ({
                      ...prev,
                      donatorName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resources" className="text-right">
                {t("donationsTable.popup.resources")}
                </Label>
                <Input
                  id="resources"
                  placeholder="Apple, Banana, Orange"
                  className="col-span-3"
                  onChange={(event) => {
                    const resources = event.target.value.split(",");

                    setNewDonation((prev) => ({
                      ...prev,
                      resources: resources.map((resource) => ({
                        resourceId: 0,
                        name: resource,
                        quantity: 0,
                      })),
                    }));
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddNewDonation}>{t("donationsTable.popup.saveButton")}</Button>
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
