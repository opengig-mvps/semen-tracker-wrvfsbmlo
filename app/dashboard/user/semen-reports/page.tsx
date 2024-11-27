"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import axios, { isAxiosError } from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const semenReportSchema = z.object({
  date: z.date(),
  count: z.number().min(1, "Count must be a positive number"),
  motility: z.number().min(0, "Motility must be between 0 and 100").max(100, "Motility must be between 0 and 100"),
  morphology: z.number().min(0, "Morphology must be between 0 and 100").max(100, "Morphology must be between 0 and 100"),
});

type SemenReportFormData = z.infer<typeof semenReportSchema>;

const SemenReportsPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [semenReports, setSemenReports] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SemenReportFormData>({
    resolver: zodResolver(semenReportSchema),
  });

  useEffect(() => {
    const fetchSemenReports = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/users/${session?.user?.id}/semenReports`);
        setSemenReports(res?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemenReports();
  }, [session]);

  const onSubmit = async (data: SemenReportFormData) => {
    try {
      const payload = {
        date: data?.date?.toISOString(),
        count: data?.count,
        motility: data?.motility,
        morphology: data?.morphology,
      };

      const response = await axios.post(`/api/users/${session?.user?.id}/semenReports`, payload);

      if (response?.data?.success) {
        toast.success("Semen report logged successfully!");
        setSemenReports([...semenReports, response?.data?.data]);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Log New Semen Report</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>New Semen Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Date</Label>
              <DateTimePicker
                date={selectedDate}
                setDate={(date: Date | undefined) => {
                  setSelectedDate(date);
                  if (date) {
                    setValue("date", date);
                  }
                }}
              />
              {errors?.date && (
                <p className="text-red-500 text-sm">{errors?.date?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Count</Label>
              <Input
                {...register("count", { valueAsNumber: true })}
                type="number"
                placeholder="Enter count"
              />
              {errors?.count && (
                <p className="text-red-500 text-sm">{errors?.count?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Motility</Label>
              <Input
                {...register("motility", { valueAsNumber: true })}
                type="number"
                placeholder="Enter motility (0-100)"
              />
              {errors?.motility && (
                <p className="text-red-500 text-sm">{errors?.motility?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Morphology</Label>
              <Input
                {...register("morphology", { valueAsNumber: true })}
                type="number"
                placeholder="Enter morphology (0-100)"
              />
              {errors?.morphology && (
                <p className="text-red-500 text-sm">{errors?.morphology?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Logging Report...
                </>
              ) : (
                "Log Report"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-6">Semen Report History</h2>
      {loading ? (
        <div>Loading semen reports...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Motility</TableHead>
              <TableHead>Morphology</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semenReports?.map((report: any) => (
              <TableRow key={report?.id}>
                <TableCell>{new Date(report?.date).toLocaleDateString()}</TableCell>
                <TableCell>{report?.count}</TableCell>
                <TableCell>{report?.motility}%</TableCell>
                <TableCell>{report?.morphology}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SemenReportsPage;