import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_auth/account")({
  component: AccountComponent,
});

// TODO: Add account page
function AccountComponent() {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pl" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <>
      <div className="bg-panel-gradient inline-flex w-full items-center justify-between gap-2 bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">Accounr</h1>
          <p className="ml-1 font-light text-gray-600">
            Edit profile your mather ....
          </p>
        </div>

        <Toggle
          aria-label="Toggle language"
          onClick={handleChangeLanguage}
          className="uppercase"
        >
          {currentLanguage}
        </Toggle>
      </div>

      <div className="mx-auto grid w-full grid-cols-2 gap-10 px-4">
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstname">Imię</Label>
            <Input id="firstname" type="firstname" placeholder="..." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="surname">Nazwisko</Label>
            <Input id="surname" type="surname" placeholder="..." required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+48000000000" required />
          </div>

          <Button className="mt-2 w-full">Zmień dane</Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="repeatPassword">Password x2</Label>
            <Input
              id="repeatPassword"
              type="password"
              placeholder="********"
              required
            />
          </div>

          <Button className="mt-2 w-full">Zmień hasło kutwo</Button>
        </div>
      </div>
    </>
  );
}
