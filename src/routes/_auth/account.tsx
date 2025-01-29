import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/utils/api";
import { Response, useAuth } from "@/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_auth/account")({
  component: AccountComponent,
});

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface UserPasswordData {
  password: string;
  repeatPassword: string;
}

function AccountComponent() {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [status, setStatus] = useState<string>("");
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>(
    user ?? {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    }
  );
  const [passwordData, setPasswordData] = useState<UserPasswordData>({
    password: "",
    repeatPassword: "",
  });

  const handleChangeUserDataInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (name in userData) {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleChangePasswordDataInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (name in passwordData) {
      setPasswordData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pl" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const handleChangeUserData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !userData.email ||
      !userData.phone ||
      !userData.firstName ||
      !userData.lastName
    ) {
      setStatus("empty");
      return;
    }

    try {
      const response = await api<Response>("/api/update", "PUT", userData);
      setStatus(response.status);
    } catch (error) {
      console.error("Failed to update user data:", error);
      setStatus("error");
    }
  };

  const handleChangePasswordData = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!passwordData.password || !passwordData.repeatPassword) {
      setStatus("empty");
      return;
    }

    if (passwordData.password !== passwordData.repeatPassword) {
      setStatus("password");
      return;
    }

    if (passwordData.password.length < 8) {
      setStatus("password_short");
      return;
    }

    try {
      const response = await api<Response>("/user/password", "PUT", userData);
      setStatus(response.status);
    } catch (error) {
      console.error("Failed to update password:", error);
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
      {status && (
        <Alert
          variant={status === "success" ? "default" : "destructive"}
          className="absolute bottom-8 right-8 w-full max-w-sm bg-white"
        >
          <AlertTitle>{t("accountPage.alert.title")}</AlertTitle>
          <AlertDescription>
            {t(`accountPage.alert.${status}`)}
          </AlertDescription>
        </Alert>
      )}
      <div className="inline-flex w-full items-center justify-between gap-2 bg-panel-gradient bg-cover bg-no-repeat px-4 py-6">
        <div>
          <h1 className="text-4xl font-semibold">{t("accountPage.title")}</h1>
          <p className="ml-1 font-light text-gray-600">
            {t("accountPage.subtitle")}
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
        <form onSubmit={handleChangeUserData}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstname">
                {t("accountPage.form.firstname")}
              </Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="..."
                required
                onChange={handleChangeUserDataInput}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">{t("accountPage.form.surname")}</Label>
              <Input
                id="surname"
                name="surname"
                type="text"
                placeholder="..."
                required
                onChange={handleChangeUserDataInput}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("accountPage.form.email")}</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="mail@example.com"
                required
                onChange={handleChangeUserDataInput}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">{t("accountPage.form.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="000000000"
                required
                onChange={handleChangeUserDataInput}
              />
            </div>
            <Button className="mt-2 w-full" type="submit">
              {t("accountPage.dataButton")}
            </Button>
          </div>
        </form>

        <form onSubmit={handleChangePasswordData}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">{t("accountPage.form.password")}</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                minLength={8}
                required
                onChange={handleChangePasswordDataInput}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeatPassword">
                {t("accountPage.form.repeatPassword")}
              </Label>
              <Input
                id="repeatPassword"
                type="password"
                name="repeatPassword"
                placeholder="********"
                minLength={8}
                required
                onChange={handleChangePasswordDataInput}
              />
            </div>

            <Button className="mt-2 w-full" type="submit">
              {t("accountPage.passwordButton")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
