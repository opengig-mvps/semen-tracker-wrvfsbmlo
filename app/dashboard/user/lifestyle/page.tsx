"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
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
import { DateTimePicker } from "@/components/ui/date-picker";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";

const lifestyleSchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  diet: z.string().min(1, "Diet is required"),
  exercise: z.string().min(1, "Exercise is required"),
  sleepHours: z.number().positive("Sleep hours must be positive"),
});

type LifestyleFormData = z.infer<typeof lifestyleSchema>;

const LifestylePage: React.FC = () => {
  const { data: session } = useSession();
  const [lifestyleLogs, setLifestyleLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LifestyleFormData>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: {
      date: undefined,
      diet: "",
      exercise: "",
      sleepHours: undefined,
    },
  });

  const fetchLifestyleLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/${session?.user?.id}/lifestyleLogs`);
      if (res?.data?.success) {
        setLifestyleLogs(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchLifestyleLogs();
    }
  }, [session]);

  const onSubmit = async (data: LifestyleFormData) => {
    try {
      const payload = {
        date: data?.date?.toISOString(),
        diet: data?.diet,
        exercise: data?.exercise,
        sleepHours: data?.sleepHours,
      };

      const response = await api.post(
        `/api/users/${session?.user?.id}/lifestyleLogs`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Lifestyle log created successfully!");
        reset();
        fetchLifestyleLogs();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async (logId: number) => {
    try {
      const res = await api.delete(`/api/users/${session?.user?.id}/lifestyleLogs/${logId}`);
      if (res?.data?.success) {
        toast.success("Lifestyle log deleted successfully!");
        fetchLifestyleLogs();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lifestyle log");
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Log Your Lifestyle Habits</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Lifestyle Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <DateTimePicker
                date={undefined}
                setDate={(date: Date | undefined) => {
                  if (!date) return;
                  reset({
                    ...control.getValues(),
                    date,
                  });
                }}
              />
              {errors?.date && (
                <p className="text-red-500 text-sm">{errors?.date?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diet">Diet</Label>
              <Input {...register("diet")} placeholder="Enter your diet" />
              {errors?.diet && (
                <p className="text-red-500 text-sm">{errors?.diet?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Input {...register("exercise")} placeholder="Enter your exercise" />
              {errors?.exercise && (
                <p className="text-red-500 text-sm">{errors?.exercise?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleepHours">Sleep Hours</Label>
              <Input
                {...register("sleepHours")}
                type="number"
                placeholder="Enter your sleep hours"
              />
              {errors?.sleepHours && (
                <p className="text-red-500 text-sm">
                  {errors?.sleepHours?.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Logging...
                </>
              ) : (
                "Log Lifestyle"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <h2 className="text-xl font-bold mt-8 mb-4">Lifestyle Logs</h2>
      {loading ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Diet</TableHead>
              <TableHead>Exercise</TableHead>
              <TableHead>Sleep Hours</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lifestyleLogs?.map((log: any) => (
              <TableRow key={log?.id}>
                <TableCell>{new Date(log?.date).toLocaleDateString()}</TableCell>
                <TableCell>{log?.diet}</TableCell>
                <TableCell>{log?.exercise}</TableCell>
                <TableCell>{log?.sleepHours}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(log?.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LifestylePage;