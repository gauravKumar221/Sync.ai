"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Lock,
  Mail,
  Smartphone,
  Globe,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { API } from "@/lib/api";
import { useAuth } from "@/app/context/auth-context";

// User profile type
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  timezone: string;
  language: string;
  created_at: string;
  last_login: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Profile State
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    timezone: "Asia/Kolkata",
    language: "English",
    created_at: "",
    last_login: "",
  });

  // Forgot Password State
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] =
    useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // ✅ FETCH USER PROFILE
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsProfileLoading(true);
    try {
      // Get user from context (already stored in localStorage)
      if (user) {
        setProfileData({
          id: user.id?.toString() || "",
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "User",
          timezone: "Asia/Kolkata",
          language: "English",
          created_at: "",
          last_login: "",
        });
      }

      // You can also fetch from API if needed
      const token = localStorage.getItem("Auth");
      if (token) {
        try {
          const response = await fetch(API.profile, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProfileData((prev) => ({
              ...prev,
              ...data,
              id: data.id?.toString() || prev.id,
              name: data.name || prev.name,
              email: data.email || prev.email,
              phone: data.phone || prev.phone,
              role: data.role || prev.role,
            }));
          }
        } catch (apiError) {
          console.log("Optional API fetch failed, using local data");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile.",
        variant: "destructive",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  // ✅ HANDLE PROFILE UPDATE
  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("Auth");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to update profile.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Update via API
      const response = await fetch(API.updateProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          timezone: profileData.timezone,
          language: profileData.language,
        }),
      });

      if (response.ok) {
        // Update local context
        updateProfile({
          name: profileData.name,
          phone: profileData.phone,
        });

        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ HANDLE FORGOT PASSWORD - SEND OTP
  const handleSendOTP = async () => {
    if (!forgotPasswordData.email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOTPSent(true);
        setOtpCountdown(60);

        const countdownInterval = setInterval(() => {
          setOtpCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast({
          title: "OTP Sent",
          description:
            data.message || "Check your email for the verification code.",
        });
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send OTP. Please check your email address.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ HANDLE RESEND OTP
  const handleResendOTP = async () => {
    if (otpCountdown > 0) {
      toast({
        title: "Wait",
        description: `Please wait ${otpCountdown} seconds before resending OTP.`,
      });
      return;
    }

    await handleSendOTP();
  };

  // ✅ HANDLE FORGOT PASSWORD RESET (SINGLE-STEP APPROACH)
  const handleForgotPasswordReset = async () => {
    // Validate inputs
    if (!forgotPasswordData.email) {
      toast({
        title: "Error",
        description: "Email is required.",
        variant: "destructive",
      });
      return;
    }

    if (!forgotPasswordData.otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP.",
        variant: "destructive",
      });
      return;
    }

    if (forgotPasswordData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "OTP must be 6 digits.",
        variant: "destructive",
      });
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (forgotPasswordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(forgotPasswordData.newPassword)) {
      toast({
        title: "Weak Password",
        description:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);
    try {
      // ✅ Use the combined endpoint - verifyAndResetPassword
      const response = await fetch(API.verifyAndResetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword,
          confirmPassword: forgotPasswordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Password Reset Successful",
          description:
            data.message || "You can now login with your new password.",
        });

        // Reset form
        setForgotPasswordData({
          email: "",
          newPassword: "",
          confirmPassword: "",
          otp: "",
        });
        setIsOTPSent(false);
        setOtpCountdown(0);

        // Optional: Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to reset password. Please check your OTP and try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Timezone options
  const timezones = [
    "Asia/Kolkata",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Dubai",
    "Asia/Singapore",
    "Australia/Sydney",
  ];

  // Language options
  const languages = [
    "English",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Arabic",
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Time";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account profile and password recovery.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="h-4 w-4" />
            Forgot Password
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isProfileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                  <p>Loading profile...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className="bg-muted"
                          placeholder="Your email"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profileData.role}
                        disabled
                        className="bg-muted"
                        placeholder="Your role"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={profileData.timezone}
                        onValueChange={(value) =>
                          setProfileData({ ...profileData, timezone: value })
                        }
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <SelectValue placeholder="Select timezone" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={profileData.language}
                        onValueChange={(value) =>
                          setProfileData({ ...profileData, language: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Account Information (Read-only) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Account Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            User ID:
                          </span>
                          <span className="font-mono">
                            {profileData.id || "USR-001"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Account Created:
                          </span>
                          <span>{formatDate(profileData.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Last Login:
                          </span>
                          <span>
                            {profileData.last_login ? (
                              <>
                                {formatDate(profileData.last_login)} at{" "}
                                {formatTime(profileData.last_login)}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button onClick={handleProfileUpdate} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forgot Password Tab */}
        <TabsContent value="password" className="space-y-6">
          {/* Forgot Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">
                Forgot Password
              </CardTitle>
              <CardDescription>
                Reset your password if you've forgotten it. You'll need access
                to your registered email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Registered Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotPasswordData.email}
                    onChange={(e) =>
                      setForgotPasswordData({
                        ...forgotPasswordData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter your registered email"
                    disabled={isOTPSent}
                  />
                </div>

                {!isOTPSent ? (
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || otpCountdown > 0}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : otpCountdown > 0 ? (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Resend in {otpCountdown}s
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="otp">Verification Code (OTP)</Label>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={handleResendOTP}
                            disabled={otpCountdown > 0}
                          >
                            {otpCountdown > 0
                              ? `Resend in ${otpCountdown}s`
                              : "Resend OTP"}
                          </Button>
                        </div>
                        <Input
                          id="otp"
                          value={forgotPasswordData.otp}
                          onChange={(e) =>
                            setForgotPasswordData({
                              ...forgotPasswordData,
                              otp: e.target.value,
                            })
                          }
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="forgot-new-password">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="forgot-new-password"
                            type={showForgotNewPassword ? "text" : "password"}
                            value={forgotPasswordData.newPassword}
                            onChange={(e) =>
                              setForgotPasswordData({
                                ...forgotPasswordData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() =>
                              setShowForgotNewPassword(!showForgotNewPassword)
                            }
                          >
                            {showForgotNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="forgot-confirm-password">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="forgot-confirm-password"
                            type={
                              showForgotConfirmPassword ? "text" : "password"
                            }
                            value={forgotPasswordData.confirmPassword}
                            onChange={(e) =>
                              setForgotPasswordData({
                                ...forgotPasswordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() =>
                              setShowForgotConfirmPassword(
                                !showForgotConfirmPassword,
                              )
                            }
                          >
                            {showForgotConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsOTPSent(false);
                          setForgotPasswordData({
                            ...forgotPasswordData,
                            otp: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleForgotPasswordReset}
                        disabled={
                          isResettingPassword ||
                          forgotPasswordData.otp.length !== 6 ||
                          !forgotPasswordData.newPassword ||
                          !forgotPasswordData.confirmPassword
                        }
                      >
                        {isResettingPassword ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Resetting...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <p>💡 Password requirements:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Minimum 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character (@$!%*?&)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Technical details about your account and system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Account Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono">
                      {profileData.id || "USR-001"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Account Created:
                    </span>
                    <span>{formatDate(profileData.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login:</span>
                    <span>
                      {profileData.last_login ? (
                        <>
                          {formatDate(profileData.last_login)} at{" "}
                          {formatTime(profileData.last_login)}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Application Version</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frontend:</span>
                    <Badge variant="outline">v2.1.0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backend API:</span>
                    <Badge variant="outline">v1.5.2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database:</span>
                    <Badge variant="outline">MySQL 8.0</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
