import { API_URL, POST_URL } from "@/lib/apiEndPoints";

export async function getPosts(token: string, nextPage?: string, searchQuery?: string, sortBy?: string) {
  let url = API_URL + POST_URL;
  if (nextPage) {
    url = nextPage;
  }
  if (searchQuery) {
    url += `?title=${encodeURIComponent(searchQuery)}`;
  }
  if (sortBy) {
    url += `${searchQuery ? '&' : '?'}sort_by=${sortBy}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function likePost(token: string, postId: number) {
  const url = `${API_URL}${POST_URL}/${postId}/like`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to like post");
  }

  return res.json();
}
