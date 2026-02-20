import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { seedDatabase } from "./seed.tsx";

const app = new Hono();

// Initialize Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const accessToken = authHeader.split(' ')[1];
  if (!accessToken || accessToken === supabaseAnonKey) {
    return null;
  }
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) {
    console.log('Authorization error while verifying user:', error);
    return null;
  }
  return user;
}

// Health check endpoint
app.get("/make-server-85349416/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed endpoint - for development/demo purposes
app.post("/make-server-85349416/seed", async (c) => {
  try {
    const result = await seedDatabase();
    return c.json(result);
  } catch (error) {
    console.log('Error running seed:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== AUTH ROUTES ====================

// Sign up - Create new user
app.post("/make-server-85349416/auth/signup", async (c) => {
  try {
    const { email, password, username } = await c.req.json();
    
    if (!email || !password || !username) {
      return c.json({ error: 'Email, password, and username are required' }, 400);
    }

    // Check if username is already taken
    const existingUsers = await kv.getByPrefix(`user_profile:`);
    const usernameTaken = existingUsers.some(u => 
      u.value && typeof u.value === 'object' && 'username' in u.value && 
      u.value.username.toLowerCase() === username.toLowerCase()
    );
    
    if (usernameTaken) {
      return c.json({ error: 'Username is already taken' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Error creating user during signup:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const userProfile = {
      id: data.user.id,
      username,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      verified: false,
      createdAt: new Date().toISOString(),
      bio: '',
      badges: [],
    };

    await kv.set(`user_profile:${data.user.id}`, userProfile);
    await kv.set(`user_email:${email}`, data.user.id);

    return c.json({ 
      user: userProfile,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.log('Server error during signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Sign in - Login user
app.post("/make-server-85349416/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Error signing in user during login:', error);
      return c.json({ error: error.message }, 401);
    }

    // Get user profile
    const profile = await kv.get(`user_profile:${data.user.id}`);
    
    return c.json({ 
      accessToken: data.session.access_token,
      user: profile || { id: data.user.id, email: data.user.email },
    });
  } catch (error) {
    console.log('Server error during signin:', error);
    return c.json({ error: 'Internal server error during signin' }, 500);
  }
});

// Get current session
app.get("/make-server-85349416/auth/session", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ user: null, session: null });
    }

    const profile = await kv.get(`user_profile:${user.id}`);
    return c.json({ 
      user: profile || { id: user.id, email: user.email },
      session: { access_token: c.req.header('Authorization')?.split(' ')[1] }
    });
  } catch (error) {
    console.log('Error fetching session:', error);
    return c.json({ error: 'Internal server error fetching session' }, 500);
  }
});

// Sign out
app.post("/make-server-85349416/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No session to sign out' }, 400);
    }

    const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);
    if (error) {
      console.log('Error signing out user:', error);
    }

    return c.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.log('Server error during signout:', error);
    return c.json({ error: 'Internal server error during signout' }, 500);
  }
});

// ==================== USER PROFILE ROUTES ====================

// Get user profile
app.get("/make-server-85349416/users/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`user_profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(profile);
  } catch (error) {
    console.log('Error fetching user profile:', error);
    return c.json({ error: 'Internal server error fetching user profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-85349416/users/:userId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    if (user.id !== userId) {
      return c.json({ error: 'Forbidden - can only update own profile' }, 403);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user_profile:${userId}`);
    
    if (!currentProfile) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedProfile = { ...currentProfile, ...updates, id: userId };
    await kv.set(`user_profile:${userId}`, updatedProfile);
    
    return c.json(updatedProfile);
  } catch (error) {
    console.log('Error updating user profile:', error);
    return c.json({ error: 'Internal server error updating user profile' }, 500);
  }
});

// ==================== POST ROUTES ====================

// Get all posts (feed)
app.get("/make-server-85349416/posts", async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    const show = c.req.query('show');

    const allPosts = await kv.getByPrefix('post:');
    
    // Filter and sort posts
    let posts = allPosts
      .filter(p => p.value && !p.value.isDeleted)
      .map(p => p.value);

    if (show) {
      posts = posts.filter(p => p.show?.toLowerCase().includes(show.toLowerCase()));
    }

    // Sort by timestamp (newest first)
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const paginatedPosts = posts.slice(offset, offset + limit);

    return c.json({ 
      posts: paginatedPosts,
      total: posts.length,
      hasMore: offset + limit < posts.length
    });
  } catch (error) {
    console.log('Error fetching posts:', error);
    return c.json({ error: 'Internal server error fetching posts' }, 500);
  }
});

// Get single post
app.get("/make-server-85349416/posts/:postId", async (c) => {
  try {
    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post || post.isDeleted) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    return c.json(post);
  } catch (error) {
    console.log('Error fetching post:', error);
    return c.json({ error: 'Internal server error fetching post' }, 500);
  }
});

// Create new post
app.post("/make-server-85349416/posts", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - must be logged in to create posts' }, 401);
    }

    const { show, content, hasSpoiler, tags, image } = await c.req.json();
    
    if (!show || !content) {
      return c.json({ error: 'Show and content are required' }, 400);
    }

    // Get user profile
    const userProfile = await kv.get(`user_profile:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const postId = crypto.randomUUID();
    const post = {
      id: postId,
      author: {
        id: userProfile.id,
        username: userProfile.username,
        avatar: userProfile.avatar,
        verified: userProfile.verified,
      },
      show,
      content,
      hasSpoiler: hasSpoiler || false,
      tags: tags || [],
      reactions: {
        upvotes: 0,
        comments: 0,
        shares: 0,
      },
      upvotedBy: [],
      createdAt: new Date().toISOString(),
      timestamp: 'Just now',
      image: image || null,
      isDeleted: false,
    };

    await kv.set(`post:${postId}`, post);
    
    // Add to user's posts
    const userPosts = await kv.get(`user_posts:${user.id}`) || [];
    userPosts.push(postId);
    await kv.set(`user_posts:${user.id}`, userPosts);

    return c.json(post, 201);
  } catch (error) {
    console.log('Error creating post:', error);
    return c.json({ error: 'Internal server error creating post' }, 500);
  }
});

// Update post
app.put("/make-server-85349416/posts/:postId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (post.author.id !== user.id) {
      return c.json({ error: 'Forbidden - can only edit own posts' }, 403);
    }

    const updates = await c.req.json();
    const updatedPost = { ...post, ...updates, id: postId, author: post.author };
    
    await kv.set(`post:${postId}`, updatedPost);
    
    return c.json(updatedPost);
  } catch (error) {
    console.log('Error updating post:', error);
    return c.json({ error: 'Internal server error updating post' }, 500);
  }
});

// Delete post
app.delete("/make-server-85349416/posts/:postId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (post.author.id !== user.id) {
      return c.json({ error: 'Forbidden - can only delete own posts' }, 403);
    }

    // Soft delete
    post.isDeleted = true;
    await kv.set(`post:${postId}`, post);
    
    return c.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log('Error deleting post:', error);
    return c.json({ error: 'Internal server error deleting post' }, 500);
  }
});

// Upvote post
app.post("/make-server-85349416/posts/:postId/upvote", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - must be logged in to upvote' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);
    
    if (!post || post.isDeleted) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const upvotedBy = post.upvotedBy || [];
    const hasUpvoted = upvotedBy.includes(user.id);

    if (hasUpvoted) {
      // Remove upvote
      post.upvotedBy = upvotedBy.filter(id => id !== user.id);
      post.reactions.upvotes = Math.max(0, post.reactions.upvotes - 1);
    } else {
      // Add upvote
      post.upvotedBy = [...upvotedBy, user.id];
      post.reactions.upvotes += 1;
    }

    await kv.set(`post:${postId}`, post);
    
    return c.json({ 
      upvotes: post.reactions.upvotes,
      hasUpvoted: !hasUpvoted 
    });
  } catch (error) {
    console.log('Error toggling upvote on post:', error);
    return c.json({ error: 'Internal server error toggling upvote' }, 500);
  }
});

// ==================== COMMENT ROUTES ====================

// Get comments for a post
app.get("/make-server-85349416/posts/:postId/comments", async (c) => {
  try {
    const postId = c.req.param('postId');
    const comments = await kv.get(`post_comments:${postId}`) || [];
    
    return c.json({ comments });
  } catch (error) {
    console.log('Error fetching comments:', error);
    return c.json({ error: 'Internal server error fetching comments' }, 500);
  }
});

// Create comment
app.post("/make-server-85349416/posts/:postId/comments", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - must be logged in to comment' }, 401);
    }

    const postId = c.req.param('postId');
    const { content, parentId } = await c.req.json();
    
    if (!content) {
      return c.json({ error: 'Content is required' }, 400);
    }

    const post = await kv.get(`post:${postId}`);
    if (!post || post.isDeleted) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const userProfile = await kv.get(`user_profile:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const commentId = crypto.randomUUID();
    const comment = {
      id: commentId,
      author: {
        id: userProfile.id,
        username: userProfile.username,
        avatar: userProfile.avatar,
        verified: userProfile.verified,
      },
      content,
      reactions: {
        upvotes: 0,
      },
      upvotedBy: [],
      createdAt: new Date().toISOString(),
      timestamp: 'Just now',
      replies: [],
    };

    // Get existing comments
    let comments = await kv.get(`post_comments:${postId}`) || [];

    if (parentId) {
      // Add as reply to parent comment
      const addReply = (commentsList) => {
        return commentsList.map(c => {
          if (c.id === parentId) {
            return { ...c, replies: [...(c.replies || []), comment] };
          } else if (c.replies?.length > 0) {
            return { ...c, replies: addReply(c.replies) };
          }
          return c;
        });
      };
      comments = addReply(comments);
    } else {
      // Add as top-level comment
      comments.push(comment);
    }

    await kv.set(`post_comments:${postId}`, comments);

    // Update post comment count
    post.reactions.comments = (post.reactions.comments || 0) + 1;
    await kv.set(`post:${postId}`, post);

    return c.json(comment, 201);
  } catch (error) {
    console.log('Error creating comment:', error);
    return c.json({ error: 'Internal server error creating comment' }, 500);
  }
});

// Upvote comment
app.post("/make-server-85349416/comments/:commentId/upvote", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - must be logged in to upvote' }, 401);
    }

    const commentId = c.req.param('commentId');
    const postId = c.req.query('postId');
    
    if (!postId) {
      return c.json({ error: 'postId query parameter is required' }, 400);
    }

    let comments = await kv.get(`post_comments:${postId}`) || [];

    const updateComment = (commentsList) => {
      return commentsList.map(comment => {
        if (comment.id === commentId) {
          const upvotedBy = comment.upvotedBy || [];
          const hasUpvoted = upvotedBy.includes(user.id);
          
          if (hasUpvoted) {
            return {
              ...comment,
              upvotedBy: upvotedBy.filter(id => id !== user.id),
              reactions: { ...comment.reactions, upvotes: Math.max(0, comment.reactions.upvotes - 1) }
            };
          } else {
            return {
              ...comment,
              upvotedBy: [...upvotedBy, user.id],
              reactions: { ...comment.reactions, upvotes: comment.reactions.upvotes + 1 }
            };
          }
        } else if (comment.replies?.length > 0) {
          return { ...comment, replies: updateComment(comment.replies) };
        }
        return comment;
      });
    };

    comments = updateComment(comments);
    await kv.set(`post_comments:${postId}`, comments);

    return c.json({ message: 'Comment upvote toggled successfully' });
  } catch (error) {
    console.log('Error toggling upvote on comment:', error);
    return c.json({ error: 'Internal server error toggling comment upvote' }, 500);
  }
});

// ==================== SEARCH ROUTES ====================

// Search posts and users
app.get("/make-server-85349416/search", async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase();
    const type = c.req.query('type') || 'all'; // 'posts', 'users', or 'all'
    
    if (!query) {
      return c.json({ posts: [], users: [] });
    }

    const results = { posts: [], users: [] };

    if (type === 'posts' || type === 'all') {
      const allPosts = await kv.getByPrefix('post:');
      results.posts = allPosts
        .filter(p => p.value && !p.value.isDeleted)
        .map(p => p.value)
        .filter(post => 
          post.show?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.text?.toLowerCase().includes(query))
        )
        .slice(0, 20);
    }

    if (type === 'users' || type === 'all') {
      const allUsers = await kv.getByPrefix('user_profile:');
      results.users = allUsers
        .filter(u => u.value)
        .map(u => u.value)
        .filter(user => 
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
        )
        .slice(0, 20);
    }

    return c.json(results);
  } catch (error) {
    console.log('Error searching:', error);
    return c.json({ error: 'Internal server error during search' }, 500);
  }
});

// ==================== NOTIFICATION ROUTES ====================

// Get user notifications
app.get("/make-server-85349416/notifications", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notifications = await kv.get(`user_notifications:${user.id}`) || [];
    
    return c.json({ notifications });
  } catch (error) {
    console.log('Error fetching notifications:', error);
    return c.json({ error: 'Internal server error fetching notifications' }, 500);
  }
});

// Mark notification as read
app.put("/make-server-85349416/notifications/:notificationId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('notificationId');
    let notifications = await kv.get(`user_notifications:${user.id}`) || [];
    
    notifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    await kv.set(`user_notifications:${user.id}`, notifications);
    
    return c.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.log('Error updating notification:', error);
    return c.json({ error: 'Internal server error updating notification' }, 500);
  }
});

Deno.serve(app.fetch);