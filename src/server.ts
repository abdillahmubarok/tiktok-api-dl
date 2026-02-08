import { Hono } from 'hono';
import { cors } from 'hono/cors';
import Tiktok from './index';

// Initialize Hono app
const app = new Hono();

// Add CORS middleware
app.use('/*', cors());

// Error handling middleware
app.onError((err, c) => {
  return c.json({ status: 'error', message: err.message }, 500);
});

// Helper to get cookie from header or query
const getCookie = (c: any): string | undefined => {
  const cookieHeader = c.req.header('X-Tiktok-Cookie');
  const cookieQuery = c.req.query('cookie');
  return cookieHeader || cookieQuery;
};

// Route handlers
app.get('/api/download', async (c) => {
  const url = c.req.query('url');
  const version = c.req.query('version');

  if (!url) throw new Error('URL is required');

  const result = await Tiktok.Downloader(url as string, {
    version: (version as "v1" | "v2" | "v3") || "v1"
  });
  return c.json(result);
});

app.get('/api/search/user', async (c) => {
  const keyword = c.req.query('keyword');
  const page = c.req.query('page');
  const cookie = getCookie(c);

  if (!keyword) throw new Error('Keyword is required');

  const result = await Tiktok.Search(keyword as string, {
    type: 'user',
    cookie: cookie || '',
    page: page ? Number(page) : 1
  });
  return c.json(result);
});

app.get('/api/search/live', async (c) => {
  const keyword = c.req.query('keyword');
  const page = c.req.query('page');
  const cookie = getCookie(c);

  if (!keyword) throw new Error('Keyword is required');

  const result = await Tiktok.Search(keyword as string, {
    type: 'live',
    cookie: cookie || '',
    page: page ? Number(page) : 1
  });
  return c.json(result);
});

app.get('/api/search/video', async (c) => {
  const keyword = c.req.query('keyword');
  const page = c.req.query('page');
  const cookie = getCookie(c);

  if (!keyword) throw new Error('Keyword is required');

  const result = await Tiktok.Search(keyword as string, {
    type: 'video',
    cookie: cookie || '',
    page: page ? Number(page) : 1
  });
  return c.json(result);
});

app.get('/api/stalk', async (c) => {
  const username = c.req.query('username');
  if (!username) throw new Error('Username is required');
  const result = await Tiktok.StalkUser(username as string);
  return c.json(result);
});

app.get('/api/comments', async (c) => {
  const url = c.req.query('url');
  const limit = c.req.query('limit');
  if (!url) throw new Error('URL is required');
  const result = await Tiktok.GetVideoComments(url as string, {
    commentLimit: limit ? Number(limit) : 10
  });
  return c.json(result);
});

app.get('/api/user/posts', async (c) => {
  const username = c.req.query('username');
  const limit = c.req.query('limit');
  const cookie = getCookie(c);

  if (!username) throw new Error('Username is required');

  const result = await Tiktok.GetUserPosts(username as string, {
    postLimit: limit ? Number(limit) : 10,
    cookie: cookie || undefined
  });
  return c.json(result);
});

app.get('/api/user/reposts', async (c) => {
  const username = c.req.query('username');
  const limit = c.req.query('limit');

  if (!username) throw new Error('Username is required');

  const result = await Tiktok.GetUserReposts(username as string, {
    postLimit: limit ? Number(limit) : 10
  });
  return c.json(result);
});

app.get('/api/user/liked', async (c) => {
  const username = c.req.query('username');
  const limit = c.req.query('limit');
  const cookie = getCookie(c);

  if (!username) throw new Error('Username is required');
  if (!cookie) throw new Error('Cookie is required for this endpoint');

  const result = await Tiktok.GetUserLiked(username as string, {
    cookie: cookie,
    postLimit: limit ? Number(limit) : 10
  });
  return c.json(result);
});

app.get('/api/collection', async (c) => {
  const url = c.req.query('url');
  const id = c.req.query('id');
  const page = c.req.query('page');
  const count = c.req.query('count');

  const collectionIdOrUrl = url || id;
  if (!collectionIdOrUrl) throw new Error('URL or ID is required');

  const result = await Tiktok.Collection(collectionIdOrUrl as string, {
    page: page ? Number(page) : 1,
    count: count ? Number(count) : 10
  });
  return c.json(result);
});

app.get('/api/playlist', async (c) => {
  const url = c.req.query('url');
  const id = c.req.query('id');
  const page = c.req.query('page');
  const count = c.req.query('count');

  const playlistIdOrUrl = url || id;
  if (!playlistIdOrUrl) throw new Error('URL or ID is required');

  const result = await Tiktok.Playlist(playlistIdOrUrl as string, {
    page: page ? Number(page) : 1,
    count: count ? Number(count) : 10
  });
  return c.json(result);
});

app.get('/api/trending', async (c) => {
  const type = c.req.query('type');

  if (type === 'creators') {
    const result = await Tiktok.TrendingCreators();
    return c.json(result);
  } else {
    const result = await Tiktok.Trending();
    return c.json(result);
  }
});

app.get('/api/music/videos', async (c) => {
  const url = c.req.query('url');
  const id = c.req.query('id');
  const page = c.req.query('page');
  const count = c.req.query('count');

  const musicIdOrUrl = url || id;
  if (!musicIdOrUrl) throw new Error('URL or ID is required');

  const result = await Tiktok.GetVideosByMusicId(musicIdOrUrl as string, {
    page: page ? Number(page) : 1,
    count: count ? Number(count) : 30
  });
  return c.json(result);
});

app.get('/api/music/detail', async (c) => {
  const url = c.req.query('url');
  const id = c.req.query('id');
  const cookie = getCookie(c);

  const musicIdOrUrl = url || id;
  if (!musicIdOrUrl) throw new Error('URL or ID is required');
  if (!cookie) throw new Error('Cookie is required for this endpoint');

  const result = await Tiktok.GetMusicDetail(musicIdOrUrl as string, {
    cookie: cookie
  });
  return c.json(result);
});

// Start the server if running in Node.js (local development)
if (typeof process !== 'undefined' && process.release?.name === 'node') {
  import('@hono/node-server').then(({ serve }) => {
    const port = Number(process.env.PORT) || 3000;
    serve({
      fetch: app.fetch,
      port
    }, (info) => {
      console.log(`Server is running on port ${info.port}`);
    });
  });
}

// Export the app for Cloudflare Workers
export default app;
