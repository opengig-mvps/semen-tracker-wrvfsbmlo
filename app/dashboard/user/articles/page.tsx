"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, Bookmark, Search } from "lucide-react";

type Article = {
  id: number;
  title: string;
  author: string;
  category: string;
  publicationDate: string;
};

const ArticlesPage: React.FC = () => {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/articles");
        if (response?.data?.success) {
          setArticles(response?.data?.data);
          toast.success("Articles fetched successfully!");
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

    fetchArticles();
  }, []);

  const handleBookmark = async (articleId: number) => {
    try {
      const response = await axios.post(`/api/articles/${articleId}/bookmark`);
      if (response?.data?.success) {
        toast.success("Article bookmarked successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/articles/search`, {
        params: { query: searchTerm },
      });
      if (response?.data?.success) {
        setArticles(response?.data?.data);
        toast.success("Articles searched successfully!");
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">
        Educational Articles on Semen Health
      </h2>
      <div className="mb-6 flex items-center space-x-2">
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </div>
      {loading ? (
        <LoaderCircleIcon className="animate-spin mx-auto" />
      ) : (
        articles?.map((article: Article) => (
          <Card key={article?.id} className="mb-4">
            <CardHeader>
              <CardTitle>{article?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Author: {article?.author}</p>
              <p>Category: {article?.category}</p>
              <p>
                Published on:{" "}
                {new Date(article?.publicationDate).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBookmark(article?.id)}
              >
                <Bookmark className="w-4 h-4 mr-2" /> Bookmark
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default ArticlesPage;