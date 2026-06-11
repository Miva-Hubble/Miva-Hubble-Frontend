import type { Question } from "../types/question";

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    title: "Can someone explain AVL Tree rotation with examples?",
    body: "I'm struggling to understand when and how to perform left and right rotations in AVL trees. Could someone walk through a step-by-step example with diagrams? I specifically need help understanding the difference between single and double rotations.",
    excerpt:
      "I'm struggling to understand when and how to perform left and right rotations in AVL trees. Could someone walk through a step-by-step example...",
    status: "solved",
    courseCode: "CSC301",
    tags: [
      { label: "CSC301", isCourse: true },
      { label: "Data Structures" },
      { label: "Trees" },
    ],
    author: "Hubblite",
    level: "300",
    timestamp: "2 hours ago",
    upvotes: 23,
    answers: [
      {
        id: "a1",
        body: "AVL rotations restore balance when the balance factor exceeds 1 or -1. A single left rotation fixes a right-heavy subtree, while a double rotation (right-left or left-right) handles zig-zag cases. Start by computing balance factors bottom-up after each insertion.",
        author: "CodeMaster",
        level: "400",
        timestamp: "1 hour ago",
        upvotes: 12,
        isAccepted: true,
      },
      {
        id: "a2",
        body: "I found this helpful: draw the tree before and after each rotation. Label each node's height. That made the zig-zag cases click for me.",
        author: "StudyBuddy",
        level: "300",
        timestamp: "45 min ago",
        upvotes: 5,
      },
    ],
  },
  {
    id: "2",
    title: "Best way to prepare for CSC401 final exam?",
    body: "The final covers everything from software engineering models to testing strategies. What topics should I prioritize? Any past questions or study groups available?",
    excerpt:
      "The final covers everything from software engineering models to testing strategies. What topics should I prioritize?",
    status: "open",
    courseCode: "CSC401",
    tags: [
      { label: "CSC401", isCourse: true },
      { label: "Exam Prep" },
      { label: "Study Tips" },
    ],
    author: "Hubblite",
    level: "400",
    timestamp: "5 hours ago",
    upvotes: 18,
    answers: [
      {
        id: "a3",
        body: "Focus on UML diagrams, SDLC models, and unit vs integration testing. Past questions from 2022 and 2023 repeat a lot of the design pattern questions.",
        author: "SeniorDev",
        level: "400",
        timestamp: "3 hours ago",
        upvotes: 8,
      },
    ],
  },
  {
    id: "3",
    title: "How do I fix a segmentation fault in my C pointer assignment?",
    body: "My linked list delete function keeps crashing with a segfault. I think I'm dereferencing a freed pointer but I can't pinpoint where. Here's my approach: I traverse to the node, update next pointers, then free. What am I missing?",
    excerpt:
      "My linked list delete function keeps crashing with a segfault. I think I'm dereferencing a freed pointer but I can't pinpoint where.",
    status: "open",
    courseCode: "CSC201",
    tags: [
      { label: "CSC201", isCourse: true },
      { label: "Programming" },
      { label: "Assignments" },
    ],
    author: "NewCoder",
    level: "200",
    timestamp: "1 day ago",
    upvotes: 9,
    answers: [],
  },
  {
    id: "4",
    title: "Difference between BFS and DFS — when to use each?",
    body: "I understand how both traversals work mechanically, but I'm confused about when professors expect us to pick one over the other in exam questions. Are there rules of thumb?",
    excerpt:
      "I understand how both traversals work mechanically, but I'm confused about when professors expect us to pick one over the other.",
    status: "solved",
    courseCode: "CSC301",
    tags: [
      { label: "CSC301", isCourse: true },
      { label: "Algorithms" },
      { label: "Data Structures" },
    ],
    author: "GraphNerd",
    level: "300",
    timestamp: "2 days ago",
    upvotes: 31,
    answers: [
      {
        id: "a4",
        body: "Use BFS for shortest path in unweighted graphs and level-order traversal. Use DFS for cycle detection, topological sort, and exploring all paths. Memory-wise, BFS uses O(width) queue space while DFS uses O(height) stack space.",
        author: "AlgoTutor",
        level: "400",
        timestamp: "2 days ago",
        upvotes: 19,
        isAccepted: true,
      },
    ],
  },
  {
    id: "5",
    title: "Tips for staying focused during online lectures?",
    body: "I keep getting distracted during back-to-back online classes. What strategies have worked for you? Looking for practical tips, not just 'put your phone away'.",
    excerpt:
      "I keep getting distracted during back-to-back online classes. What strategies have worked for you?",
    status: "open",
    courseCode: "GST101",
    tags: [
      { label: "GST101", isCourse: true },
      { label: "Study Tips" },
    ],
    author: "FocusedOne",
    level: "100",
    timestamp: "3 days ago",
    upvotes: 42,
    answers: [
      {
        id: "a5",
        body: "Active note-taking every 10 minutes helps. I also use the Pomodoro technique between lectures and keep a dedicated study space.",
        author: "TopStudent",
        level: "300",
        timestamp: "2 days ago",
        upvotes: 15,
      },
      {
        id: "a6",
        body: "Rewatch at 1.25x and pause to summarize each section in one sentence. Forces engagement.",
        author: "Hubblite",
        level: "200",
        timestamp: "2 days ago",
        upvotes: 7,
      },
    ],
  },
  {
    id: "6",
    title: "SQL JOIN query returning duplicate rows — help!",
    body: "I'm joining three tables for my database assignment and getting way more rows than expected. I think my ON clause is wrong but I'm not sure how to debug it. Using INNER JOIN on student, enrollment, and course tables.",
    excerpt:
      "I'm joining three tables for my database assignment and getting way more rows than expected. I think my ON clause is wrong.",
    status: "open",
    courseCode: "CSC401",
    tags: [
      { label: "CSC401", isCourse: true },
      { label: "Database" },
      { label: "Assignments" },
    ],
    author: "SQLRookie",
    level: "300",
    timestamp: "4 days ago",
    upvotes: 14,
    answers: [],
  },
];

export default MOCK_QUESTIONS;
