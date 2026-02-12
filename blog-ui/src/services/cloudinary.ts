
const cloudName = "dqk1lwc8u"; 
const API_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export async function uploadImage(data: FormData): Promise<string> {
  const resp = await fetch(`${API_URL}`, {
    method: "POST",
    body: data
  });
  const result = await resp.json();
  return result.secure_url;
}