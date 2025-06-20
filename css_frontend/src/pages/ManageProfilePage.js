"use client";

import "../styles/ManageProfilePage.css";
import { useState, useEffect } from "react";
import "../styles/ManageProfilePage.css";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser } from "../api/userApi";
import { toast } from "react-toastify";
import { Eye, EyeOff, ArrowLeft } from "lucide-react"; // Using Lucide React icons
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"; // Changed to relative path
import { Input } from "../components/ui/input"; // Changed to relative path
import { Label } from "../components/ui/label"; // Changed to relative path
import { Button } from "../components/ui/button"; // Changed to relative path
import ConfirmDialog from "../components/ConfirmDialog"; // Existing ConfirmDialog

const ManageProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id || storedUser?.userId; // Ensure we get the MongoDB _id

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          toast.error("❌ User ID not found. Please log in again.");
          navigate("/login");
          return;
        }

        const data = await getUserById(userId);
        setFormData({
          userName: data.userName || "",
          email: data.email || "",
          password: "********", // for display only, never pre-fill actual password
          phoneNo: data.phoneNo || "",
        });
      } catch (err) {
        console.error("Error loading user data:", err);
        toast.error("❌ Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    try {
      // Only send fields that are actually editable and not the placeholder password
      const { password, ...safeData } = formData;
      await updateUser(userId, safeData);
      toast.success("✅ Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("❌ Update failed. Please try again.");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userId, formData.userName);
      toast.success("✅ Account deleted. Logging out...");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("❌ Failed to delete account. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-cyan-600 text-white rounded-t-lg p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Manage Profile
          </CardTitle>
          <Button
            variant="outline"
            className="bg-white text-cyan-600 hover:bg-gray-100 hover:text-cyan-700 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              disabled // Email is typically not editable
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                readOnly
                placeholder="********"
                className="pr-10" // Add padding for the icon
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Contact support to change your password.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone Number</Label>
            <Input
              id="phoneNo"
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              onClick={handleEdit}
            >
              Update Profile
            </Button>
            <Button
              type="button"
              variant="destructive" // Shadcn destructive variant for red button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => setShowConfirmDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete your account? This action cannot be undone."
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={confirmDelete}
          confirmButtonText="Yes, Delete My Account"
          cancelButtonText="Cancel"
          title="Confirm Account Deletion"
        />
      )}
    </div>
  );
};

export default ManageProfilePage;
