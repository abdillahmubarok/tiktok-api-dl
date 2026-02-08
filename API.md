# Tiktok API Documentation

This documentation describes the API endpoints available when the project is deployed as a web service.

## Base URL

By default, the API runs on port 3000.
`http://localhost:3000`

## Authentication

Some endpoints require a TikTok cookie. You can provide the cookie in two ways:

1.  **HTTP Header (Recommended):** Pass the cookie in the `X-Tiktok-Cookie` header.
2.  **Query Parameter:** Pass the cookie in the `cookie` query parameter (e.g., `?cookie=YOUR_COOKIE`).

**Note:** Using the HTTP header is recommended for security to avoid exposing sensitive tokens in URL logs.

## Endpoints

### 1. Download Media

Download videos, images, or music from a TikTok URL.

- **URL:** `/api/download`
- **Method:** `GET`
- **Parameters:**
  - `url` (required): The TikTok URL (e.g., `https://vt.tiktok.com/...` or `https://www.tiktok.com/@user/video/...`).
  - `version` (optional): The downloader version (`v1`, `v2`, or `v3`). Defaults to `v1`.

**Example:**
`GET /api/download?url=https://vt.tiktok.com/ZSeJ7y8/&version=v1`

### 2. Search Users

Search for TikTok users.

- **URL:** `/api/search/user`
- **Method:** `GET`
- **Parameters:**
  - `keyword` (required): The search query.
  - `page` (optional): Page number. Defaults to 1.
  - `cookie` (optional): TikTok cookie for authentication.

**Example:**
`GET /api/search/user?keyword=charlidamelio&page=1`

### 3. Search Live Streams

Search for ongoing live streams.

- **URL:** `/api/search/live`
- **Method:** `GET`
- **Parameters:**
  - `keyword` (required): The search query.
  - `page` (optional): Page number. Defaults to 1.
  - `cookie` (optional): TikTok cookie.

**Example:**
`GET /api/search/live?keyword=gaming`

### 4. Search Videos

Search for videos.

- **URL:** `/api/search/video`
- **Method:** `GET`
- **Parameters:**
  - `keyword` (required): The search query.
  - `page` (optional): Page number. Defaults to 1.
  - `cookie` (optional): TikTok cookie.

**Example:**
`GET /api/search/video?keyword=funny`

### 5. Stalk User

Get detailed profile information for a user.

- **URL:** `/api/stalk`
- **Method:** `GET`
- **Parameters:**
  - `username` (required): The TikTok username.

**Example:**
`GET /api/stalk?username=khaby.lame`

### 6. Get Video Comments

Get comments from a video.

- **URL:** `/api/comments`
- **Method:** `GET`
- **Parameters:**
  - `url` (required): The video URL.
  - `limit` (optional): Number of comments to fetch. Defaults to 10.

**Example:**
`GET /api/comments?url=https://vt.tiktok.com/ZSeJ7y8/&limit=20`

### 7. Get User Posts

Get a list of videos posted by a user.

- **URL:** `/api/user/posts`
- **Method:** `GET`
- **Parameters:**
  - `username` (required): The TikTok username.
  - `limit` (optional): Number of posts to fetch. Defaults to 10.
  - `cookie` (optional): TikTok cookie.

**Example:**
`GET /api/user/posts?username=tiktok&limit=5`

### 8. Get User Reposts

Get a list of videos reposted by a user.

- **URL:** `/api/user/reposts`
- **Method:** `GET`
- **Parameters:**
  - `username` (required): The TikTok username.
  - `limit` (optional): Number of reposts to fetch. Defaults to 10.

**Example:**
`GET /api/user/reposts?username=tiktok`

### 9. Get User Liked Videos

Get a list of videos liked by a user. **Requires Cookie.**

- **URL:** `/api/user/liked`
- **Method:** `GET`
- **Parameters:**
  - `username` (required): The TikTok username.
  - `cookie` (required): TikTok cookie.
  - `limit` (optional): Number of videos to fetch. Defaults to 10.

**Example:**
`GET /api/user/liked?username=tiktok` (with `X-Tiktok-Cookie` header)

### 10. Get Collection

Get videos from a collection.

- **URL:** `/api/collection`
- **Method:** `GET`
- **Parameters:**
  - `url` or `id` (required): Collection URL or ID.
  - `page` (optional): Page number.
  - `count` (optional): Number of items.

**Example:**
`GET /api/collection?id=7507916135931218695`

### 11. Get Playlist

Get videos from a playlist.

- **URL:** `/api/playlist`
- **Method:** `GET`
- **Parameters:**
  - `url` or `id` (required): Playlist URL or ID.
  - `page` (optional): Page number.
  - `count` (optional): Number of items.

**Example:**
`GET /api/playlist?id=7507916135931218695`

### 12. Get Trending

Get trending content or creators.

- **URL:** `/api/trending`
- **Method:** `GET`
- **Parameters:**
  - `type` (optional): Set to `creators` to fetch trending creators. Otherwise fetches trending content.

**Example:**
`GET /api/trending`
`GET /api/trending?type=creators`

### 13. Get Music Videos

Get videos using a specific music track.

- **URL:** `/api/music/videos`
- **Method:** `GET`
- **Parameters:**
  - `url` or `id` (required): Music URL or ID.
  - `page` (optional): Page number.
  - `count` (optional): Number of videos.

**Example:**
`GET /api/music/videos?id=6771810675950880769`

### 14. Get Music Detail

Get details about a music track.

- **URL:** `/api/music/detail`
- **Method:** `GET`
- **Parameters:**
  - `url` or `id` (required): Music URL or ID.
  - `cookie` (required): TikTok cookie.

**Example:**
`GET /api/music/detail?id=6771810675950880769` (with `X-Tiktok-Cookie` header)

## Error Handling

All endpoints return a JSON response. In case of an error, the response will be:

```json
{
  "status": "error",
  "message": "Error description"
}
```
