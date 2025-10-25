// Define the cache structure
const cache = {
  data: null,
  lastFetch: 0,
};
const CACHE_TTL_MINUTES = 5; // How long to keep cache (in minutes)

// This is the main function Cloudflare runs when '/api' is called
export async function onRequest(context) {
  // Get the secret keys from Cloudflare's environment variables (we'll set these up later)
  const pageId = context.env.FACEBOOK_PAGE_ID;
  const accessToken = context.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  // --- Cache Check ---
  const now = Date.now();
  const cacheTTLMilliseconds = CACHE_TTL_MINUTES * 60 * 1000;
  if (cache.data && (now - cache.lastFetch < cacheTTLMilliseconds)) {
    console.log('Serving Facebook posts from cache.');
    // If cache is good, send the cached data immediately
    return new Response(JSON.stringify(cache.data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allows your website to call it
        'Cache-Control': `public, max-age=${Math.round((cacheTTLMilliseconds - (now - cache.lastFetch)) / 1000)}` // Tell browser how long to cache
      },
    });
  }

  console.log('Fetching new posts from Facebook...');

  // --- Security Check ---
  if (!pageId || !accessToken) {
    console.error("Missing Facebook credentials in environment variables.");
    return new Response(JSON.stringify({ error: 'Server is not configured.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }

  // --- Prepare Facebook API Call ---
  const fields = 'message,created_time,full_picture,permalink_url';
  const url = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=${fields}&access_token=${accessToken}&limit=10`;

  try {
    // --- Fetch from Facebook ---
    const response = await fetch(url); // Use fetch, which is built into Cloudflare
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Facebook API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    const fbData = await response.json();

    // --- Process the Data ---
    const posts = fbData.data.map(post => ({
      id: post.id,
      message: post.message,
      created_time: post.created_time,
      image: post.full_picture || null,
      permalink_url: post.permalink_url,
    })).filter(post => post.message); // Only include posts that have a message

    // --- Update Cache ---
    cache.data = posts;
    cache.lastFetch = now;
    console.log('Successfully fetched Facebook posts and updated cache.');

    // --- Send Success Response ---
    return new Response(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${CACHE_TTL_MINUTES * 60}` // Tell browser to cache for 5 mins
      },
    });

  } catch (error) {
    console.error('Error fetching from Facebook API:', error.message);

    // --- Send Error Response (but use cache if we have old data) ---
    if (cache.data) {
      console.log('API fetch failed. Serving stale Facebook data from cache.');
      return new Response(JSON.stringify(cache.data), { // Send old data
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60' // Cache stale data for 1 min
        },
      });
    }

    // If no cache, send a proper error
    return new Response(JSON.stringify({ error: 'Failed to fetch Facebook posts.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}