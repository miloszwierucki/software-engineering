import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FALLBACK = "/";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || FALLBACK });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const { logIn, signUp } = useAuth();
  const router = useRouter();
  const search = Route.useSearch();

  const [activeTab, setActiveTab] = useState("log-in");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("empty");
      return;
    }

    if (password.length < 8) {
      setError("password_short");
      return;
    }

    try {
      const response = await logIn(email, password);

      if (response === "error") {
        throw new Error("Login failed");
      }
      router.history.push(search.redirect || FALLBACK);
    } catch (error) {
      setError("default");
      console.error("Login failed", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName || !phone || !role) {
      setError("empty");
      return;
    }

    if (password !== repeatPassword) {
      setError("password");
      return;
    }

    if (password.length < 8) {
      setError("password_short");
      return;
    }

    try {
      const response = await signUp(
        firstName,
        lastName,
        role,
        email,
        password,
        phone
      );

      if (response === "error") {
        throw new Error("Sign up failed");
      }
      router.history.push(search.redirect || FALLBACK);
    } catch (error) {
      setError("default");
      console.error("Sign up failed", error);
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  return (
    <main className="relative flex h-screen items-center justify-center bg-sign-up bg-cover bg-center bg-no-repeat">
      {error && (
        <Alert
          variant="destructive"
          className="absolute bottom-8 right-8 w-full max-w-sm bg-white"
        >
          <AlertTitle>{t("auth.error")}</AlertTitle>
          <AlertDescription>{t(`auth.error_${error}`)}</AlertDescription>
        </Alert>
      )}
      <Card className="w-full max-w-md p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex w-full">
            <TabsList className="m-auto grid w-full max-w-xs grid-cols-2">
              <TabsTrigger value="sign-up">{t("auth.tabs.signUp")}</TabsTrigger>
              <TabsTrigger value="log-in">{t("auth.tabs.logIn")}</TabsTrigger>
            </TabsList>
            <Toggle
              aria-label="Toggle language"
              onClick={handleChangeLanguage}
              className="uppercase"
            >
              {currentLanguage}
            </Toggle>
          </div>

          <TabsContent value="log-in">
            <CardHeader>
              <CardTitle className="text-2xl">{t("loginPage.title")}</CardTitle>
              <CardDescription>{t("loginPage.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("loginPage.form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      {t("loginPage.form.password")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      minLength={8}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t("loginPage.button")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="sign-up">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("signUpPage.title")}
              </CardTitle>
              <CardDescription>{t("signUpPage.description")}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">
                      {t("signUpPage.form.firstname")}
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="..."
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">
                      {t("signUpPage.form.surname")}
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="..."
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role">
                      {t("signUpPage.form.role.role")}
                    </Label>
                    <Select onValueChange={(value) => setRole(value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donator">
                          {t("signUpPage.form.role.donator")}
                        </SelectItem>
                        <SelectItem value="volunteer">
                          {t("signUpPage.form.role.volunteer")}
                        </SelectItem>
                        <SelectItem value="victim">
                          {t("signUpPage.form.role.victim")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("signUpPage.form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      {t("signUpPage.form.password")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      minLength={8}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="repeatPassword">
                      {t("signUpPage.form.repeatPassword")}
                    </Label>
                    <Input
                      id="repeatPassword"
                      type="password"
                      placeholder="********"
                      value={repeatPassword}
                      minLength={8}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">{t("signUpPage.form.phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="000000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="[0-9]{9}"
                      required
                    />
                  </div>

                  <div className="inline-flex items-center gap-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms">{t("signUpPage.terms")}</Label>
                  </div>

                  <Button type="submit" className="mt-2 w-full">
                    {t("signUpPage.button")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
