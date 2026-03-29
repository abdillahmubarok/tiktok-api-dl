import { Hono } from 'hono'
import Tiktok from './index'

const app = new Hono()

app.get('/', (c) => c.json({
  message: "TikTok API DL is running!",
  endpoints: [
    "/dl?url=...",
    "/search?keyword=...&type=user|video|live",
    "/stalk?username=...",
    "/posts?username=...",
    "/liked?username=...",
    "/comments?url=...",
    "/music/videos?id=...",
    "/music/detail?id=...",
    "/trending",
    "/trending/creators"
  ]
}))

// Downloader
app.get('/dl', async (c) => {
  const url = c.req.query('url')
  const version = c.req.query('version') as "v1" | "v2" | "v3"
  const proxy = c.req.query('proxy')

  if (!url) return c.json({ status: "error", message: "Missing url parameter" }, 400)

  const result = await Tiktok.Downloader(url, { version, proxy })
  return c.json(result)
})

// Search
app.get('/search', async (c) => {
  const keyword = c.req.query('keyword')
  const type = c.req.query('type') as "user" | "video" | "live"
  const page = c.req.query('page') ? parseInt(c.req.query('page')!) : 1
  const cookie = c.req.header('X-Tiktok-Cookie') || c.req.query('cookie') // Support header or query
  const proxy = c.req.query('proxy')

  if (!keyword) return c.json({ status: "error", message: "Missing keyword parameter" }, 400)
  if (!cookie) return c.json({ status: "error", message: "Missing cookie (X-Tiktok-Cookie header or cookie query param)" }, 400)

  const result = await Tiktok.Search(keyword, { type, page, cookie, proxy })
  return c.json(result)
})

// Stalk User
app.get('/stalk', async (c) => {
  const username = c.req.query('username')
  const proxy = c.req.query('proxy')

  if (!username) return c.json({ status: "error", message: "Missing username parameter" }, 400)

  const result = await Tiktok.StalkUser(username, { proxy })
  return c.json(result)
})

// Get User Posts
app.get('/posts', async (c) => {
  const username = c.req.query('username')
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 10
  const proxy = c.req.query('proxy')
  const cookie = c.req.header('X-Tiktok-Cookie') || c.req.query('cookie')

  if (!username) return c.json({ status: "error", message: "Missing username parameter" }, 400)

  const result = await Tiktok.GetUserPosts(username, { postLimit: limit, proxy, cookie })
  return c.json(result)
})

// Get User Liked
app.get('/liked', async (c) => {
  const username = c.req.query('username')
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 10
  const proxy = c.req.query('proxy')
  const cookie = c.req.header('X-Tiktok-Cookie') || c.req.query('cookie')

  if (!username) return c.json({ status: "error", message: "Missing username parameter" }, 400)
  if (!cookie) return c.json({ status: "error", message: "Missing cookie (X-Tiktok-Cookie header or cookie query param)" }, 400)

  const result = await Tiktok.GetUserLiked(username, { postLimit: limit, proxy, cookie })
  return c.json(result)
})

// Get User Reposts
app.get('/reposts', async (c) => {
  const username = c.req.query('username')
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 10
  const proxy = c.req.query('proxy')

  if (!username) return c.json({ status: "error", message: "Missing username parameter" }, 400)

  const result = await Tiktok.GetUserReposts(username, { postLimit: limit, proxy })
  return c.json(result)
})

// Get Comments
app.get('/comments', async (c) => {
  const url = c.req.query('url')
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 10
  const proxy = c.req.query('proxy')

  if (!url) return c.json({ status: "error", message: "Missing url parameter" }, 400)

  const result = await Tiktok.GetVideoComments(url, { commentLimit: limit, proxy })
  return c.json(result)
})

// Trending
app.get('/trending', async (c) => {
  const proxy = c.req.query('proxy')
  const result = await Tiktok.Trending({ proxy })
  return c.json(result)
})

// Trending Creators
app.get('/trending/creators', async (c) => {
  const proxy = c.req.query('proxy')
  const result = await Tiktok.TrendingCreators({ proxy })
  return c.json(result)
})

// Music Videos
app.get('/music/videos', async (c) => {
  const id = c.req.query('id') || c.req.query('url')
  const page = c.req.query('page') ? parseInt(c.req.query('page')!) : 1
  const count = c.req.query('count') ? parseInt(c.req.query('count')!) : 30
  const proxy = c.req.query('proxy')

  if (!id) return c.json({ status: "error", message: "Missing id or url parameter" }, 400)

  const result = await Tiktok.GetVideosByMusicId(id, { page, count, proxy })
  return c.json(result)
})

// Music Detail
app.get('/music/detail', async (c) => {
  const id = c.req.query('id') || c.req.query('url')
  const proxy = c.req.query('proxy')
  const cookie = c.req.header('X-Tiktok-Cookie') || c.req.query('cookie')

  if (!id) return c.json({ status: "error", message: "Missing id or url parameter" }, 400)
  if (!cookie) return c.json({ status: "error", message: "Missing cookie (X-Tiktok-Cookie header or cookie query param)" }, 400)

  const result = await Tiktok.GetMusicDetail(id, { cookie, proxy })
  return c.json(result)
})

export default app
