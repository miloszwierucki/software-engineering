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

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Donation</SheetTitle>
          <SheetDescription>
            Edit the donation details from <strong>{data?.donator.name}</strong>
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="donator" className="text-right">
              {t("donationsTable.popup.donator")}
            </Label>
            <Input
              id="donator"
              placeholder="Pedro Duarte"
              className="col-span-3"
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              {t("donationsTable.popup.status")}
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="donationDate" className="text-right">
              {t("donationsTable.popup.donationDate")}
            </Label>
            <DatePicker />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="acceptDate" className="text-right">
              {t("donationsTable.popup.acceptDate")}
            </Label>
            <DatePicker />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button>{t("donationsTable.popup.saveButton")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
