/**
 * SEO Weekly Actions 타입 정의
 */

export interface WeeklyAction {
  id: string;
  title: string;
  description: string;
  category: "content" | "technical" | "link" | "image" | "meta";
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  estimatedTime: string;
  aiTip?: string;
}

export interface WeeklyActionsResponse {
  success: boolean;
  actions?: WeeklyAction[];
  summary?: string;
  error?: string;
  cached?: boolean;
}
