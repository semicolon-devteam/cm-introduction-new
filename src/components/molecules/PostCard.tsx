import Link from "next/link";
import { MessageSquare, Heart, Bookmark, Share2, Eye } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@atoms/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@atoms/Avatar";
import { Badge } from "@atoms/Badge";
import { Button } from "@atoms/Button";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
}

export function PostCard({
  id,
  title,
  excerpt,
  author,
  category,
  tags,
  stats,
  createdAt,
}: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>
          </div>
          <Badge variant="secondary">{category}</Badge>
        </div>

        {/* Post Title */}
        <div>
          <Link href={`/posts/${id}`}>
            <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {/* Post Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {stats.views}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {stats.comments}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {stats.likes}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">북마크</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">공유</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
