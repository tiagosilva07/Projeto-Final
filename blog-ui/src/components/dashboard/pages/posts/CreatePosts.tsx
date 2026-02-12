import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { usePostsApi, type CreatePostData, type CreatePostForm } from "@/services/posts";
import { useCategoriesApi} from "@/services/categories";
import { MultiSelect } from "@/components/MultiSelect";
import { uploadImage } from "@/services/cloudinary";
import { ImageUploader } from "@/components/ImageUploader";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/categoy";

export default function CreatePost() {
  const { token } = useAuth();
  const { refreshPosts } = usePosts();
  const { createPost } = usePostsApi();
  const { getCategories } = useCategoriesApi();
  const navigate = useNavigate();

  const [form, setForm] = useState<CreatePostForm>({
    title: "",
    content: "",
    categoryIds: [],
    imageFile: null,
    imagePreview: "",
    imageUrl: undefined,
    status: "DRAFT",
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    categoryIds: "",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleImageUpload(): Promise<string | undefined> {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", form.imageFile!);
    formData.append("upload_preset", "blog_images"); // Replace with your upload preset

    try {
    if (!form.imageFile) return undefined;
      const imageUrl = await uploadImage(formData);
      return imageUrl;
    } catch (error) {
      console.error("Failed to upload image", error);
    return undefined;
    }finally {
      setIsUploading(false);
    }
  }

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  }

  function validateForm(): boolean {
    const newErrors = {
      title: "",
      content: "",
      categoryIds: "",
    };

    // Title validation (3-500 characters)
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (form.title.trim().length > 500) {
      newErrors.title = "Title must not exceed 500 characters";
    }

    // Content validation
    if (!form.content.trim()) {
      newErrors.content = "Content is required";
    }

    // Category validation (at least one category required)
    if (form.categoryIds.length === 0) {
      newErrors.categoryIds = "Please select at least one category";
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.content && !newErrors.categoryIds;
  }

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    console.log("TOKEN FROM CONTEXT:", token);
    setLoading(true);
    setError("");
    setForm((prev) => ({ ...prev, status }));
    try {
    const imageUrl = await handleImageUpload();
    const postData: CreatePostData = {
        title: form.title,
        content: form.content,
        categoryIds: form.categoryIds,
        imageUrl,
        status,
    };
      await createPost(postData);
      await refreshPosts(); // Refresh posts context
      toast.success(`Post ${status === "DRAFT" ? "saved as draft" : "published"} successfully!`);
      navigate("/dashboard/posts");
    } catch (err) {
      const errorMsg = "Failed to create post";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Post title (3-500 characters)"
            className="w-full p-3 border rounded"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {form.title.length}/500 characters
          </p>
        </div>

        <div>
          <textarea
            name="content"
            placeholder="Write your content here..."
            className="w-full p-3 border rounded h-64"
            value={form.content}
            onChange={handleChange}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        <div>
          <MultiSelect
            options={categories}
            selected={form.categoryIds}
            onChange={(value) => {
              setForm((prev) => ({ ...prev, categoryIds: value }));
              setErrors((prev) => ({ ...prev, categoryIds: "" }));
            }}
          />
          {errors.categoryIds && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryIds}</p>
          )}
        </div>
        <ImageUploader
          previewUrl={form.imagePreview}
          onSelect={(file: File) => {
            setForm((prev) => ({
              ...prev,
              imageFile: file,
              imagePreview: URL.createObjectURL(file),
            }));
          }}
          onRemove={() =>
            setForm((prev) => ({
              ...prev,
              imageFile: null,
              imagePreview: "",
            }))
          }
        />

        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={() => handleSubmit("DRAFT")}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Save Draft
          </button>

          <button
            disabled={loading}
            onClick={() => handleSubmit("PUBLISHED")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Publish
          </button>
          {isUploading && ( 
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading image… 
            </div> )}
        </div>
      </div>
    </div>
  );
}
