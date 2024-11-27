"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";

const forumPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

type ForumPostFormData = z.infer<typeof forumPostSchema>;

const ForumPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [forumPosts, setForumPosts] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForumPostFormData>({
    resolver: zodResolver(forumPostSchema),
  });

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/forums/posts");
        if (res?.data?.success) {
          setForumPosts(res?.data?.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchForumPosts();
  }, []);

  const onSubmit = async (data: ForumPostFormData) => {
    try {
      const response = await api.post("/api/forums/posts", data);
      if (response?.data?.success) {
        toast.success("Forum post created successfully!");
        reset();
        setForumPosts([response?.data?.data, ...forumPosts]);
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
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Anonymous Forums</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                {...register("content")}
                placeholder="Share your thoughts on semen health"
              />
              {errors?.content && (
                <p className="text-red-500 text-sm">{errors?.content?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Forum Discussions</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          forumPosts?.map((post: any) => (
            <Card key={post?.id} className="mb-4">
              <CardContent>
                <p>{post?.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumPage;