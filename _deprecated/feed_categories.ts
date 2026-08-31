import { FileText } from "lucide-react";
import { FileQuestion } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Play } from "lucide-react";

const CATEGORIES = [
    { id: "notes", title: "Lecture Notes", desc: "Comprehensive summaries from top performing students.", count: "1.2k+ Files", rating: "4.9", icon: FileText },
    { id: "past_questions", title: "Past Questions", desc: "Archive of previous exam papers and solutions.", count: "850+ Files", rating: "4.8", icon: FileQuestion },
    { id: "textbooks", title: "Textbooks", desc: "Digital library of recommended academic texts.", count: "450+ Files", rating: "4.7", icon: BookOpen },
    { id: "videos", title: "Video Lectures", desc: "Curated video recordings and tutorial sessions.", count: "320+ Videos", rating: "5.0", icon: Play },
  ];

export default CATEGORIES