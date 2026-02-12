import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import {
  usePostsApi,
  type CreatePostData,
  type CreatePostForm,
} from "@/services/posts";
import { useCategoriesApi } from "@/services/categories";
import { MultiSelect } from "@/components/MultiSelect";
import { uploadImage } from "@/services/cloudinary";
import { ImageUploader } from "@/components/ImageUploader";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/categoy";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshPosts } = usePosts();
  const { getPostForEditById, updatePost } = usePostsApi();
  const { getCategories } = useCategoriesApi();

  const [form, setForm] = useState<CreatePostForm>({
    title: "",
    content: "",
    categoryIds: [],
    imageFile: null,
    imagePreview: "",
    imageUrl: undefined,
    status: "DRAFT",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    categoryIds: "",
  });

  // Load post + categories
  useEffect(() => {
    async function load() {
      try {
        const [post, cats] = await Promise.all([
          getPostForEditById(Number(id)),
          getCategories(),
        ]);

        setCategories(cats);

        setForm({
          title: post.title,
          content: post.content,
          categoryIds: post.categories?.map(c => c.id) || [],
          imageFile: null,
          imagePreview: post.imageUrl || "",
          imageUrl: post.imageUrl,
          status: post.status,
        });
      } catch (err) {
        console.error("Failed to load post", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleImageUpload(): Promise<string | undefined> {
    if (!form.imageFile) return form.imageUrl; // keep existing image

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", form.imageFile);
    formData.append("upload_preset", "blog_images");

    try {
      return await uploadImage(formData);
    } catch (err) {
      console.error("Image upload failed", err);
      return form.imageUrl;
    } finally {
      setIsUploading(false);
    }
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

    setSaving(true);
    setError("");

    try {
      const imageUrl = await handleImageUpload();

      const postData: CreatePostData = {
        title: form.title,
        content: form.content,
        categoryIds: form.categoryIds,
        imageUrl,
        status,
      };

      await updatePost(Number(id), postData);
      await refreshPosts(); // Refresh posts context
      toast.success(`Post ${status === "DRAFT" ? "saved as draft" : "updated and published"} successfully!`);
      
      // Navigate back to where the user came from (admin or regular posts)
      const from = location.state?.from || "/dashboard/posts";
      navigate(from);
    } catch (err) {
      console.error(err);
      const errorMsg = "Failed to update post";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Post title (3-500 characters)"
            className="w-full p-3 border rounded"
            value={form.title}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, title: e.target.value }));
              setErrors((prev) => ({ ...prev, title: "" }));
              setError("");
            }}
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
            onChange={(e) => {
              setForm((prev) => ({ ...prev, content: e.target.value }));
              setErrors((prev) => ({ ...prev, content: "" }));
              setError("");
            }}
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
              imageUrl: undefined,
            }))
          }
        />

        <div className="flex gap-4">
          <button
            disabled={saving}
            onClick={() => handleSubmit("DRAFT")}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Save Draft
          </button>

          <button
            disabled={saving}
            onClick={() => handleSubmit("PUBLISHED")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update & Publish
          </button>

          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading image…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
