"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { DotsBackground } from "@/components/ui/dots-background";
import { useToast } from "@/hooks/use-toast";
import { API } from "@/lib/api";
import { useState } from "react";
import { useAuth } from "@/app/context/auth-context";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(API.login, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data: any = await response.json();

      if (response.ok) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1);

        document.cookie = `Auth=${
          data.token
        }; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("Auth", data.token);

        const profileData = await fetch(API.profile, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        });
        const profileDataJson = await profileData.json();
        setUser(profileDataJson.user);
        localStorage.setItem("user", JSON.stringify(profileDataJson.user));

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        // ⬇️ This is the key change
        // window.location.href = "/dashboard/overview";
        router.push("/dashboard/overview");
      }

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "API failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <DotsBackground />
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="text-lg font-semibold">sync.ai</span>
        </Link>
      </div>
      <Card className="mx-auto max-w-sm z-10">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
