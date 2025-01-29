import { useTranslation } from "react-i18next";

import { DatePicker } from "@/components/ui/data-picker";
import { Donation } from "@/routes/_auth/donations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { api } from "@/utils/api";
import { Response } from "@/auth";

export function EditDonation({
  data,
  isOpen,
  setIsOpen,
}: {
  data: Donation | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { t } = useTranslation();
  const [editDonation, setEditDonation] = useState<Donation>(data!);
  const [donationDate, setDonationDate] = useState<Date>();
  const [acceptDate, setAcceptDate] = useState<Date>();

  const handleEditDonation = async (e: React.FormEvent<HTMLFormElement>) => {
    const token = localStorage.getItem("auth.token");
    e.preventDefault();

    try {
      const response = await api<Response>(
        `/api/donation/${editDonation?.donation_id}`,
        "PUT",
        { editDonation, donationDate, acceptDate },
        token!
      );

      if (response.status === "error") {
        throw new Error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };

  if (data === null) {
    return null;
  }

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Donation</SheetTitle>
          <SheetDescription>
            Edit the donation details from <strong>{data?.donator.name}</strong>
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleEditDonation}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="donator" className="text-right">
                {t("donationsTable.popup.donator")}
              </Label>
              <Input
                id="donator"
                placeholder="Pedro Duarte"
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resources" className="text-right">
                {t("donationsTable.popup.resources")}
              </Label>
              <Input
                id="resource"
                placeholder="Apple"
                className="col-span-3"
                type="text"
                required
                onChange={(event) => {
                  setEditDonation((prev) => ({
                    ...prev,
                    resource: {
                      ...prev.resource,
                      name: event.target.value,
                    },
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
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

                  setEditDonation((prev) => ({
                    ...prev,
                    resource: {
                      ...prev.resource,
                      quantity: quantity,
                    },
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t("donationsTable.popup.status")}
              </Label>
              <Select
                onValueChange={(value) =>
                  setEditDonation((prev) => ({
                    ...prev,
                    status: value as "PENDING" | "ACCEPTED" | "COMPLETED",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="donationDate" className="text-right">
                {t("donationsTable.popup.donationDate")}
              </Label>
              <DatePicker date={donationDate} setDate={setDonationDate} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="acceptDate" className="text-right">
                {t("donationsTable.popup.acceptDate")}
              </Label>
              <DatePicker date={acceptDate} setDate={setAcceptDate} />
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">
                {t("donationsTable.popup.saveButton")}
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
