import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/other/donations/data-table";
import { columns } from "@/components/other/donations/column";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Response, useAuth } from "@/auth";
import { api } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { protectRoute } from "@/routes/_auth";

type DonationSearch = {
  new: boolean;
};

export const Route = createFileRoute("/_auth/donations")({
  beforeLoad: ({ context }) => {
    protectRoute(context, ["donator", "charity"]);
  },
  component: DonationsRoute,
  validateSearch: (search: Record<string, unknown>): DonationSearch => {
    // validate and parse the search params into a typed state
    return {
      new: search.new === true,
    };
  },
});

export interface Donation {
  donation_id: number;
  donator: {
    userId: string;
    name: string;
  };
  status: "PENDING" | "ACCEPTED" | "COMPLETED";
  donationDate: string; // ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  acceptDate: string | null; // ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  resource: {
    resourceId: number;
    name: string;
    quantity: number;
  };
}

function DonationsRoute() {
  const [data, setData] = useState<Donation[]>([]);
  const { new: createNew } = Route.useSearch();
  const [openDialog, setOpenDialog] = useState(createNew);
  const { t } = useTranslation();
  const [status, setStatus] = useState<string>("");
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api<Donation[]>(
        "/donation",
        "GET",
        undefined,
        token!
      );
      setData(response);
    };
    fetchData();
  }, []);

  const [newDonation, setNewDonation] = useState<{
    donatorName: string;
    resource: {
      name: string;
      quantity: number;
    };
  }>({
    donatorName: "",
    resource: {
      name: "",
      quantity: 0,
    },
  });

  const handleAddDonation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !newDonation.donatorName ||
      !newDonation.resource.name ||
      !newDonation.resource.quantity
    ) {
      setStatus("empty");
      return;
    }

    const donation: Donation = {
      donation_id: Math.floor(Math.random() * 10000),
      donator: {
        userId: user?.id!,
        name: newDonation.donatorName,
      },
      status: "PENDING",
      donationDate: new Date().toISOString(),
      acceptDate: null,
      resource: {
        ...newDonation.resource,
        resourceId: Math.floor(Math.random() * 10000),
      },
    };

    try {
      const response = await api<Response>(
        "/api/donation",
        "POST",
        donation,
        token!
      );

      if (response.status === "error") {
        throw new Error("Sign up failed");
      }

      setStatus(response.status);
      setData([...data, donation]);
      setOpenDialog(false);
    } catch (error) {
      console.error("Sign up failed", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status) {
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }
  }, [status]);

  return (
    <>
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">
            {t("donationsTable.title")}
          </h1>
          <p className="ml-1 font-light text-gray-600">
            {t("donationsTable.subtitle")}
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              {t("donationsTable.addDonationButton")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {status && (
              <Alert
                variant={status === "success" ? "default" : "destructive"}
                className="absolute -bottom-24 left-1/2 w-full max-w-sm -translate-x-1/2 bg-white"
              >
                <AlertTitle>{t("donation.alert.title")}</AlertTitle>
                <AlertDescription>
                  {t(`donation.alert.${status}`)}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAddDonation}>
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
                    required
                    onChange={(event) =>
                      setNewDonation((prev) => ({
                        ...prev,
                        donatorName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resource" className="text-right">
                    {t("donationsTable.popup.resources")}
                  </Label>
                  <Input
                    id="resource"
                    placeholder="Apple"
                    className="col-span-3"
                    type="text"
                    required
                    onChange={(event) => {
                      setNewDonation((prev) => ({
                        ...prev,
                        resource: {
                          ...prev.resource,
                          name: event.target.value,
                        },
                      }));
                    }}
                  />
                  <Label htmlFor="quantity" className="text-right">
                    {t("donationsTable.popup.quantity")}
                  </Label>
                  <Input
                    id="quantity"
                    placeholder="10"
                    type="number"
                    pattern="[0-9]*"
                    className="col-span-3"
                    required
                    onChange={(event) => {
                      const quantity = Number(event.target.value);

                      setNewDonation((prev) => ({
                        ...prev,
                        resource: {
                          ...prev.resource,
                          quantity: quantity,
                        },
                      }));
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">
                  {t("donationsTable.popup.saveButton")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mx-auto w-full px-4">
        <DataTable columns={columns(setData, data)} data={data} />
      </div>
    </>
  );
}
