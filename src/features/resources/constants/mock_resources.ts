interface Resource {
    id: string;
    title: string;
    courseCode: string;
    courseName: string;
    level: string;
    department: string;
    fileType: string;
    uploadedBy: string;
    timestamp: string;
    stats: {
      likes: number;
      comments: number;
      downloads: number;
      views: number;
    };
    category: string;
    previewImage?: string;
  }
  
  const MOCK_RESOURCES: Resource[] = [
    {
      id: "1",
      title: "Data Structures and Algorithms - Complete Notes",
      courseCode: "CSC 301",
      courseName: "Data Structures and Algorithms",
      level: "300",
      department: "Computer Science",
      fileType: "PDF",
      uploadedBy: "Anonymous",
      timestamp: "2 days ago",
      stats: { likes: 45, comments: 12, downloads: 234, views: 567 },
      category: "Lecture Notes",
      previewImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: "2",
      title: "Linear Algebra Past Questions (2020-2023)",
      courseCode: "MTH 201",
      courseName: "Linear Algebra",
      level: "200",
      department: "Mathematics",
      fileType: "PDF",
      uploadedBy: "Tunde Bakare",
      timestamp: "1 week ago",
      stats: { likes: 89, comments: 24, downloads: 456, views: 892 },
      category: "Past Questions",
      previewImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: "3",
      title: "Artificial Intelligence Study Guide",
      courseCode: "CSC 401",
      courseName: "Artificial Intelligence",
      level: "400",
      department: "Computer Science",
      fileType: "DOCX",
      uploadedBy: "Anonymous",
      timestamp: "3 weeks ago",
      stats: { likes: 67, comments: 18, downloads: 341, views: 678 },
      category: "Study Guides",
      previewImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: "4",
      title: "Database Management Systems Lab Manual",
      courseCode: "CSC 302",
      courseName: "Database Management Systems",
      level: "300",
      department: "Computer Science",
      fileType: "PDF",
      uploadedBy: "Sarah Johnson",
      timestamp: "5 days ago",
      stats: { likes: 52, comments: 15, downloads: 287, views: 543 },
      category: "Lab Manual",
      previewImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: "5",
      title: "Introduction to Machine Learning - Comprehensive Notes",
      courseCode: "CSC 405",
      courseName: "Machine Learning",
      level: "400",
      department: "Computer Science",
      fileType: "PDF",
      uploadedBy: "Michael Chen",
      timestamp: "1 month ago",
      stats: { likes: 123, comments: 34, downloads: 678, views: 1234 },
      category: "Lecture Notes",
      previewImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ];

  export default MOCK_RESOURCES