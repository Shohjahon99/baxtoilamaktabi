export type Q = { text: string; options: string[]; correct: number; explanation?: string };

export type LessonData = {
  title: string;
  minutes: number;
  isPreview?: boolean;
  content: string;
  quiz: Q[];
};

export type CourseData = {
  slug: string;
  title: string;
  audience: string;
  shortDesc: string;
  description: string;
  emoji: string;
  image: string;
  color: string;
  price: number;
  status: "DRAFT" | "PUBLISHED";
  order: number;
  examSize?: number;
  modules: { title: string; lessons: LessonData[] }[];
  exam: Q[];
};
