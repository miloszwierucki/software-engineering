import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useState } from "react";
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
  const { logIn } = useAuth();
  const router = useRouter();
  const search = Route.useSearch();

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("log-in");

  return (
    <main className="flex h-screen items-center justify-center bg-sign-up bg-cover bg-center bg-no-repeat">
      <Card className="w-full max-w-md p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="m-auto grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="sign-up">{t("auth.tabs.signUp")}</TabsTrigger>
            <TabsTrigger value="log-in">{t("auth.tabs.logIn")}</TabsTrigger>
          </TabsList>

          <TabsContent value="log-in">
            <CardHeader>
              <CardTitle className="text-2xl">{t("loginPage.title")}</CardTitle>
              <CardDescription>{t("loginPage.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("loginPage.form.email")}</Label>
                  <Input id="email" type="email" placeholder="mail@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t("loginPage.form.password")}</Label>
                  <Input id="password" type="password" placeholder="********" required />
                </div>
                <Button
                  onClick={async () => {
                    logIn();
                    router.history.push(search.redirect || FALLBACK);
                  }}
                  className="w-full"
                >
                  {t("loginPage.button")}
                </Button>
              </div>
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
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">{t("signUpPage.form.firstname")}</Label>
                  <Input
                    id="firstname"
                    type="firstname"
                    placeholder="..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">{t("signUpPage.form.surname")}</Label>
                  <Input
                    id="surname"
                    type="surname"
                    placeholder="..."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{t("signUpPage.form.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">{t("signUpPage.form.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeatPassword">{t("signUpPage.form.repeatPassword")}</Label>
                  <Input
                    id="repeatPassword"
                    type="password"
                    placeholder="********"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">{t("signUpPage.form.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+48000000000"
                    required
                  />
                </div>

                <div className="inline-flex items-center gap-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms">{t("signUpPage.terms")}</Label>
                </div>

                <Button
                  onClick={async () => {
                    logIn();
                    router.history.push(search.redirect || FALLBACK);
                  }}
                  className="mt-2 w-full"
                >
                  {t("signUpPage.button")}
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
