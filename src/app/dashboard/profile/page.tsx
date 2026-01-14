"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/app/context/auth-context";
import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { API } from "@/lib/api";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, setUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    city: "",
    address: "",
  });

  const userProfileImage = PlaceHolderImages.find(
    (p) => p.id === "user-profile"
  );

  // 🔥 Load user data into form
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        city: user.city || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("Auth");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(API.updateProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      // Merge old user + updated fields
      const updatedUser = { ...user, ...form };

      // Save to Context
      setUser(updatedUser);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEditMode(false);

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Update failed",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={userProfileImage?.imageUrl} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Change Picture
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <div>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </div>
              <Settings2
                className="cursor-pointer"
                onClick={() => setEditMode(!editMode)}
              />
            </CardHeader>

            <form onSubmit={handleSaveChanges}>
              <CardContent className="space-y-6">
                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>

                {[
                  { label: "Full Name", key: "name" },
                  { label: "Phone", key: "phone" },
                  { label: "Location", key: "location" },
                  { label: "City", key: "city" },
                  { label: "Address", key: "address" },
                ].map((field) => (
                  <div className="space-y-2" key={field.key}>
                    <Label>{field.label}</Label>
                    <Input
                      value={form[field.key as keyof typeof form]}
                      disabled={!editMode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}

                <Separator />
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={!editMode}>
                  {editMode ? "Save Changes" : "Edit Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
