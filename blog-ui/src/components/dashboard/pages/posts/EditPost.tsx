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

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
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
      
      // Navigate back to where the user came from (admin or regular posts)
      const from = location.state?.from || "/dashboard/posts";
      navigate(from);
    } catch (err) {
      console.error(err);
      setError("Failed to update post");
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
        <input
          type="text"
          name="title"
          placeholder="Post title"
          className="w-full p-3 border rounded"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <textarea
          name="content"
          placeholder="Write your content here..."
          className="w-full p-3 border rounded h-64"
          value={form.content}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, content: e.target.value }))
          }
        />

        <MultiSelect
          options={categories}
          selected={form.categoryIds}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, categoryIds: value }))
          }
        />

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
