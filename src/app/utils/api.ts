import { projectId, publicAnonKey } from '../../utils/supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-85349416`;

export interface ApiError {
  error: string;
}

function getAuthHeaders(accessToken?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// ==================== POST API ====================

export async function getPosts(params?: { limit?: number; offset?: number; show?: string }, accessToken?: string | null) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  if (params?.show) queryParams.set('show', params.show);

  const response = await fetch(
    `${baseUrl}/posts?${queryParams}`,
    { headers: getAuthHeaders(accessToken) }
  );
  return handleResponse<{ posts: any[]; total: number; hasMore: boolean }>(response);
}

export async function getPost(postId: string, accessToken?: string | null) {
  const response = await fetch(
    `${baseUrl}/posts/${postId}`,
    { headers: getAuthHeaders(accessToken) }
  );
  return handleResponse(response);
}

export async function createPost(
  data: {
    show: string;
    content: string;
    hasSpoiler: boolean;
    tags: Array<{ text: string; color: 'purple' | 'orange' | 'blue' }>;
    image?: string;
  },
  accessToken: string
) {
  const response = await fetch(`${baseUrl}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updatePost(postId: string, data: any, accessToken: string) {
  const response = await fetch(`${baseUrl}/posts/${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deletePost(postId: string, accessToken: string) {
  const response = await fetch(`${baseUrl}/posts/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(accessToken),
  });
  return handleResponse(response);
}

export async function upvotePost(postId: string, accessToken: string) {
  const response = await fetch(`${baseUrl}/posts/${postId}/upvote`, {
    method: 'POST',
    headers: getAuthHeaders(accessToken),
  });
  return handleResponse<{ upvotes: number; hasUpvoted: boolean }>(response);
}

// ==================== COMMENT API ====================

export async function getComments(postId: string, accessToken?: string | null) {
  const response = await fetch(
    `${baseUrl}/posts/${postId}/comments`,
    { headers: getAuthHeaders(accessToken) }
  );
  return handleResponse<{ comments: any[] }>(response);
}

export async function createComment(
  postId: string,
  data: { content: string; parentId?: string },
  accessToken: string
) {
  const response = await fetch(`${baseUrl}/posts/${postId}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function upvoteComment(commentId: string, postId: string, accessToken: string) {
  const response = await fetch(
    `${baseUrl}/comments/${commentId}/upvote?postId=${postId}`,
    {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
    }
  );
  return handleResponse(response);
}

// ==================== SEARCH API ====================

export async function search(query: string, type: 'all' | 'posts' | 'users' = 'all', accessToken?: string | null) {
  const response = await fetch(
    `${baseUrl}/search?q=${encodeURIComponent(query)}&type=${type}`,
    { headers: getAuthHeaders(accessToken) }
  );
  return handleResponse<{ posts: any[]; users: any[] }>(response);
}

// ==================== USER API ====================

export async function getUser(userId: string, accessToken?: string | null) {
  const response = await fetch(
    `${baseUrl}/users/${userId}`,
    { headers: getAuthHeaders(accessToken) }
  );
  return handleResponse(response);
}

export async function updateUser(userId: string, data: any, accessToken: string) {
  const response = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// ==================== NOTIFICATION API ====================

export async function getNotifications(accessToken: string) {
  const response = await fetch(`${baseUrl}/notifications`, {
    headers: getAuthHeaders(accessToken),
  });
  return handleResponse<{ notifications: any[] }>(response);
}

export async function markNotificationRead(notificationId: string, accessToken: string) {
  const response = await fetch(`${baseUrl}/notifications/${notificationId}`, {
    method: 'PUT',
    headers: getAuthHeaders(accessToken),
  });
  return handleResponse(response);
}
