/**
 * Seed Script for SubNets Backend
 * 
 * This creates demo data to test the app:
 * - Demo user account
 * - Sample posts with different shows
 * - Sample comments
 * 
 * Run this by calling the /make-server-85349416/seed endpoint
 */

import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export async function seedDatabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Starting database seed...');

  try {
    // Create demo user
    const demoEmail = 'demo@subnets.com';
    const demoPassword = 'password';
    const demoUsername = 'DemoUser';

    // Check if demo user exists
    const existingUsers = await kv.getByPrefix('user_profile:');
    const demoExists = existingUsers.some(u => 
      u.value && typeof u.value === 'object' && 'email' in u.value && 
      u.value.email === demoEmail
    );

    let demoUserId: string;

    if (!demoExists) {
      // Create demo user
      const { data, error } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        user_metadata: { username: demoUsername },
        email_confirm: true
      });

      if (error) {
        console.error('Error creating demo user:', error);
        return { success: false, error: error.message };
      }

      demoUserId = data.user.id;

      const userProfile = {
        id: demoUserId,
        username: demoUsername,
        email: demoEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoUsername}`,
        verified: true,
        createdAt: new Date().toISOString(),
        bio: 'Demo user for SubNets',
        badges: [],
      };

      await kv.set(`user_profile:${demoUserId}`, userProfile);
      await kv.set(`user_email:${demoEmail}`, demoUserId);
      console.log('✅ Created demo user');
    } else {
      const demoUserEmail = await kv.get(`user_email:${demoEmail}`);
      demoUserId = demoUserEmail as string;
      console.log('ℹ️ Demo user already exists');
    }

    // Get demo user profile
    const demoUserProfile = await kv.get(`user_profile:${demoUserId}`);

    // Create sample posts
    const samplePosts = [
      {
        show: 'Stranger Things',
        content: 'I think Vecna is actually connected to the Mind Flayer through time manipulation. The clocks, the visions... it all adds up! 🕐',
        hasSpoiler: false,
        tags: [
          { text: 'Theory', color: 'purple' },
          { text: 'Season 4', color: 'orange' },
        ],
      },
      {
        show: 'The Last of Us',
        content: 'MAJOR SPOILER: That ending scene completely changed everything we thought we knew about Joel\'s decision...',
        hasSpoiler: true,
        tags: [
          { text: 'Spoiler', color: 'orange' },
          { text: 'Episode 9', color: 'blue' },
        ],
      },
      {
        show: 'Wednesday',
        content: 'The cinematography in the dance scene is absolutely incredible. Burton\'s signature style combined with modern aesthetics 💀',
        hasSpoiler: false,
        tags: [
          { text: 'Discussion', color: 'blue' },
          { text: 'Cinematography', color: 'purple' },
        ],
      },
      {
        show: 'Breaking Bad',
        content: 'Just finished my 5th rewatch. The foreshadowing in S1E1 is INSANE when you know how it all ends. Walter\'s pants flying in the desert? Chef\'s kiss.',
        hasSpoiler: false,
        tags: [
          { text: 'Rewatch', color: 'purple' },
          { text: 'Foreshadowing', color: 'orange' },
        ],
      },
      {
        show: 'The Mandalorian',
        content: 'Grogu mastering the Force is the best character development in Star Wars since the original trilogy. Change my mind.',
        hasSpoiler: false,
        tags: [
          { text: 'Theory', color: 'purple' },
          { text: 'Star Wars', color: 'blue' },
        ],
      },
    ];

    const createdPosts = [];
    for (const postData of samplePosts) {
      const postId = crypto.randomUUID();
      const post = {
        id: postId,
        author: {
          id: demoUserProfile.id,
          username: demoUserProfile.username,
          avatar: demoUserProfile.avatar,
          verified: demoUserProfile.verified,
        },
        ...postData,
        reactions: {
          upvotes: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 50),
          shares: Math.floor(Math.random() * 20),
        },
        upvotedBy: [],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        timestamp: '2h ago',
        isDeleted: false,
      };

      await kv.set(`post:${postId}`, post);
      createdPosts.push(post);
    }

    console.log(`✅ Created ${createdPosts.length} sample posts`);

    // Create sample comments for the first post
    if (createdPosts.length > 0) {
      const firstPost = createdPosts[0];
      const comments = [
        {
          id: crypto.randomUUID(),
          author: {
            id: demoUserProfile.id,
            username: demoUserProfile.username,
            avatar: demoUserProfile.avatar,
            verified: demoUserProfile.verified,
          },
          content: 'This is exactly what I\'ve been saying! The clock symbolism is everywhere.',
          reactions: { upvotes: 12 },
          upvotedBy: [],
          createdAt: new Date().toISOString(),
          timestamp: '1h ago',
          replies: [],
        },
        {
          id: crypto.randomUUID(),
          author: {
            id: demoUserProfile.id,
            username: demoUserProfile.username,
            avatar: demoUserProfile.avatar,
            verified: demoUserProfile.verified,
          },
          content: 'I never thought about it that way. Mind blown 🤯',
          reactions: { upvotes: 8 },
          upvotedBy: [],
          createdAt: new Date().toISOString(),
          timestamp: '30m ago',
          replies: [],
        },
      ];

      await kv.set(`post_comments:${firstPost.id}`, comments);
      console.log('✅ Created sample comments');
    }

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        demoUser: demoEmail,
        demoPassword,
        postsCreated: createdPosts.length,
      }
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error.message };
  }
}
