"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoaderCircleIcon } from "lucide-react";

type Recommendation = {
  id: number;
  createdAt: string;
  updatedAt: string;
  recommendation: string;
};

const RecommendationsPage: React.FC = () => {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${session?.user?.id}/recommendations`);
        if (response?.data?.success) {
          setRecommendations(response?.data?.data);
          toast.success("Health recommendations fetched successfully!");
        }
      } catch (error: any) {
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

    fetchRecommendations();
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      <h2 className="text-2xl font-bold">Personalized Health Recommendations</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircleIcon className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        recommendations?.map((recommendation: Recommendation) => (
          <Card key={recommendation?.id} className="border rounded-lg">
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{recommendation?.recommendation}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default RecommendationsPage;