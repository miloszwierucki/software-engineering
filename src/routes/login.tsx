import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { z } from "zod";

import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  return (
    <main className="bg-sign-up flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat">
      <Card className="w-full max-w-md p-2">
        <Tabs defaultValue="sign-up">
          <TabsList className="m-auto grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            <TabsTrigger value="log-in">Log In</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-up">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button
                  onClick={async () => {
                    logIn();
                    router.history.push(search.redirect || FALLBACK);
                  }}
                  className="w-full"
                >
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
