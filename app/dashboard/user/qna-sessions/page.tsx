"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QnaSession {
  id: number;
  title: string;
  description: string;
  scheduledDate: string;
}

const QnaSessionsPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<QnaSession[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/qna-sessions');
        if (res?.data?.success) {
          setSessions(res?.data?.data);
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? 'Something went wrong');
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleJoinSession = (sessionId: number) => {
    router.push(`/dashboard/user/qna-sessions/${sessionId}`);
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Q&A Sessions</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircleIcon className="animate-spin w-6 h-6" />
        </div>
      ) : (
        <div className="space-y-4">
          {sessions?.map((session) => (
            <Card key={session?.id}>
              <CardHeader>
                <CardTitle>{session?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{session?.description}</p>
                <div className="flex items-center space-x-2 mt-4">
                  <Calendar className="w-5 h-5" />
                  <p>{new Date(session?.scheduledDate).toLocaleString()}</p>
                </div>
                <Button
                  className="mt-4"
                  onClick={() => handleJoinSession(session?.id)}
                >
                  Join Session
                </Button>
                <Badge variant="outline" className="ml-2">
                  Upcoming
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QnaSessionsPage;