"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LoaderCircleIcon } from "lucide-react";

type Reminder = {
  id: number;
  type: string;
  message: string;
  frequency: string;
};

const ReminderManager: React.FC = () => {
  const { data: session } = useSession();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    type: "",
    message: "",
    frequency: "",
  });

  useEffect(() => {
    if (!session) return;
    const fetchReminders = async () => {
      try {
        const res = await axios.get(`/api/users/${session?.user?.id}/reminders`);
        setReminders(res?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReminders();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createReminder = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `/api/users/${session?.user?.id}/reminders`,
        formData
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setReminders([...reminders, res?.data?.data]);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (reminderId: number) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `/api/users/${session?.user?.id}/reminders/${reminderId}`
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setReminders(reminders.filter((reminder) => reminder?.id !== reminderId));
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Reminders</h2>
      <Card>
        <CardHeader>
          <CardTitle>Create Reminder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Healthy Habit">Healthy Habit</SelectItem>
                <SelectItem value="Upcoming Test">Upcoming Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              name="message"
              placeholder="Enter reminder message"
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={createReminder} disabled={loading}>
            {loading ? <LoaderCircleIcon className="animate-spin" /> : "Create Reminder"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Existing Reminders</h3>
        {reminders?.map((reminder) => (
          <Card key={reminder?.id} className="mb-4">
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{reminder?.type}</p>
                  <p>{reminder?.message}</p>
                  <p className="text-sm text-gray-500">{reminder?.frequency}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReminder(reminder?.id)}
                  disabled={loading}
                >
                  <LoaderCircleIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReminderManager;