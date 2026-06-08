export type UploadResourcePayload = {
  title: string;
  courseCode: string;
  level: string;
  departments: string[];
  categories: string[];
  file: File;
};

export async function uploadResource(payload: UploadResourcePayload): Promise<void> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("courseCode", payload.courseCode);
  formData.append("level", payload.level);
  payload.departments.forEach((dept) => formData.append("departments", dept));
  payload.categories.forEach((category) => formData.append("categories", category));
  formData.append("file", payload.file);

  // TODO: Replace with real API call when backend endpoint is available
  // await fetch("/api/resources/upload", { method: "POST", body: formData });
  console.log("Upload payload ready:", Object.fromEntries(formData.entries()));
  await new Promise((resolve) => setTimeout(resolve, 800));
}
