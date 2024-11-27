"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

interface Metric {
  date: string;
  count: number;
  motility: number;
  morphology: number;
}

interface Trends {
  countTrend: string;
  motilityTrend: string;
  morphologyTrend: string;
}

interface Goals {
  countGoal: number;
  motilityGoal: number;
  morphologyGoal: number;
}

const SemenHealthPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [trends, setTrends] = useState<Trends>({ countTrend: "", motilityTrend: "", morphologyTrend: "" });
  const [goals, setGoals] = useState<Goals>({ countGoal: 0, motilityGoal: 0, morphologyGoal: 0 });

  const fetchSemenHealthMetrics = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/users/${session?.user?.id}/semenReports`);
      if (response?.data?.success) {
        setMetrics(response?.data?.data?.metrics ?? []);
        setTrends(response?.data?.data?.trends ?? { countTrend: "", motilityTrend: "", morphologyTrend: "" });
        setGoals(response?.data?.data?.goals ?? { countGoal: 0, motilityGoal: 0, morphologyGoal: 0 });
        toast.success("Semen health metrics fetched successfully!");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemenHealthMetrics();
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Semen Health Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-background">
          <CardHeader>
            <CardTitle>Current Metrics</CardTitle>
            <CardDescription>Latest semen health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics?.map((metric: Metric, index: number) => (
              <div key={index} className="space-y-2">
                <p>Date: {new Date(metric?.date).toLocaleDateString()}</p>
                <p>Count: {metric?.count}</p>
                <p>Motility: {metric?.motility}</p>
                <p>Morphology: {metric?.morphology}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="p-4 bg-background">
          <CardHeader>
            <CardTitle>Trends & Goals</CardTitle>
            <CardDescription>Your progress and targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Count Trend: {trends?.countTrend}</p>
            <p>Motility Trend: {trends?.motilityTrend}</p>
            <p>Morphology Trend: {trends?.morphologyTrend}</p>
            <div className="space-y-2">
              <p>Count Goal: {goals?.countGoal}</p>
              <p>Motility Goal: {goals?.motilityGoal}</p>
              <p>Morphology Goal: {goals?.morphologyGoal}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-4 bg-background">
          <CardHeader>
            <CardTitle>Metrics Over Time</CardTitle>
            <CardDescription>Graphical representation of your metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="motility" stroke="#82ca9d" />
                <Line type="monotone" dataKey="morphology" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={fetchSemenHealthMetrics} className="w-full" disabled={loading}>
          {loading ? <LoaderCircleIcon className="animate-spin" /> : "Refresh Data"}
        </Button>
      </div>
    </div>
  );
};

export default SemenHealthPage;