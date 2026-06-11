import { create } from "zustand";
import MOCK_QUESTIONS from "../constants/mock_questions";
import type { Answer, NewQuestionInput, Question } from "../types/question";

type QuestionsState = {
  questions: Question[];
  addQuestion: (input: NewQuestionInput) => Question;
  addAnswer: (questionId: string, body: string) => void;
  upvoteQuestion: (questionId: string) => void;
  upvoteAnswer: (questionId: string, answerId: string) => void;
  getQuestionById: (id: string) => Question | undefined;
};

const generateId = () => Math.random().toString(36).slice(2, 10);

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  questions: MOCK_QUESTIONS,

  addQuestion: (input) => {
    const newQuestion: Question = {
      id: generateId(),
      title: input.title.trim(),
      body: input.body.trim(),
      excerpt:
        input.body.trim().length > 120
          ? `${input.body.trim().slice(0, 120)}...`
          : input.body.trim(),
      status: "open",
      courseCode: input.courseCode,
      tags: [
        { label: input.courseCode, isCourse: true },
        ...input.tags.map((tag) => ({ label: tag })),
      ],
      author: "Hubblite",
      level: "300",
      timestamp: "Just now",
      upvotes: 0,
      answers: [],
    };

    set((state) => ({
      questions: [newQuestion, ...state.questions],
    }));

    return newQuestion;
  },

  addAnswer: (questionId, body) => {
    const newAnswer: Answer = {
      id: generateId(),
      body: body.trim(),
      author: "Hubblite",
      level: "300",
      timestamp: "Just now",
      upvotes: 0,
    };

    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, newAnswer] }
          : q
      ),
    }));
  },

  upvoteQuestion: (questionId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
      ),
    }));
  },

  upvoteAnswer: (questionId, answerId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
              ),
            }
          : q
      ),
    }));
  },

  getQuestionById: (id) => get().questions.find((q) => q.id === id),
}));
