export type QuestionStatus = "open" | "solved";

export type QuestionFilter = "all" | "unanswered" | "trending";

export type QuestionTag = {
  label: string;
  isCourse?: boolean;
};

export type Answer = {
  id: string;
  body: string;
  author: string;
  level: string;
  timestamp: string;
  upvotes: number;
  isAccepted?: boolean;
};

export type Question = {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  status: QuestionStatus;
  courseCode: string;
  tags: QuestionTag[];
  author: string;
  level: string;
  timestamp: string;
  upvotes: number;
  answers: Answer[];
};

export type NewQuestionInput = {
  title: string;
  body: string;
  courseCode: string;
  tags: string[];
  isAnonymous: boolean;
};
