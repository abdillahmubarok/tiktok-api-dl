import express, { Request, Response } from 'express';
import cors from 'cors';
import Tiktok from './index';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper for error handling
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
        res.status(500).json({ status: 'error', message: error.message });
    });
};

// Helper to get cookie from header or query
const getCookie = (req: Request): string | undefined => {
    const cookieHeader = req.headers['x-tiktok-cookie'];
    const cookieQuery = req.query.cookie as string;
    return (cookieHeader as string) || cookieQuery;
};

app.get('/api/download', asyncHandler(async (req, res) => {
    const { url, version } = req.query;
    if (!url) throw new Error('URL is required');
    const result = await Tiktok.Downloader(url as string, {
        version: (version as "v1" | "v2" | "v3") || "v1"
    });
    res.json(result);
}));

app.get('/api/search/user', asyncHandler(async (req, res) => {
    const { keyword, page } = req.query;
    if (!keyword) throw new Error('Keyword is required');
    const result = await Tiktok.Search(keyword as string, {
        type: 'user',
        cookie: getCookie(req) || '',
        page: page ? Number(page) : 1
    });
    res.json(result);
}));

app.get('/api/search/live', asyncHandler(async (req, res) => {
    const { keyword, page } = req.query;
    if (!keyword) throw new Error('Keyword is required');
    const result = await Tiktok.Search(keyword as string, {
        type: 'live',
        cookie: getCookie(req) || '',
        page: page ? Number(page) : 1
    });
    res.json(result);
}));

app.get('/api/search/video', asyncHandler(async (req, res) => {
    const { keyword, page } = req.query;
    if (!keyword) throw new Error('Keyword is required');
    const result = await Tiktok.Search(keyword as string, {
        type: 'video',
        cookie: getCookie(req) || '',
        page: page ? Number(page) : 1
    });
    res.json(result);
}));

app.get('/api/stalk', asyncHandler(async (req, res) => {
    const { username } = req.query;
    if (!username) throw new Error('Username is required');
    const result = await Tiktok.StalkUser(username as string);
    res.json(result);
}));

app.get('/api/comments', asyncHandler(async (req, res) => {
    const { url, limit } = req.query;
    if (!url) throw new Error('URL is required');
    const result = await Tiktok.GetVideoComments(url as string, {
        commentLimit: limit ? Number(limit) : 10
    });
    res.json(result);
}));

app.get('/api/user/posts', asyncHandler(async (req, res) => {
    const { username, limit } = req.query;
    if (!username) throw new Error('Username is required');
    const result = await Tiktok.GetUserPosts(username as string, {
        postLimit: limit ? Number(limit) : 10,
        cookie: getCookie(req)
    });
    res.json(result);
}));

app.get('/api/user/reposts', asyncHandler(async (req, res) => {
    const { username, limit } = req.query;
    if (!username) throw new Error('Username is required');
    const result = await Tiktok.GetUserReposts(username as string, {
        postLimit: limit ? Number(limit) : 10
    });
    res.json(result);
}));

app.get('/api/user/liked', asyncHandler(async (req, res) => {
    const { username, limit } = req.query;
    const cookie = getCookie(req);
    if (!username) throw new Error('Username is required');
    if (!cookie) throw new Error('Cookie is required for this endpoint');
    const result = await Tiktok.GetUserLiked(username as string, {
        cookie: cookie as string,
        postLimit: limit ? Number(limit) : 10
    });
    res.json(result);
}));

app.get('/api/collection', asyncHandler(async (req, res) => {
    const { url, id, page, count } = req.query;
    const collectionIdOrUrl = (url as string) || (id as string);
    if (!collectionIdOrUrl) throw new Error('URL or ID is required');
    const result = await Tiktok.Collection(collectionIdOrUrl, {
        page: page ? Number(page) : 1,
        count: count ? Number(count) : 10
    });
    res.json(result);
}));

app.get('/api/playlist', asyncHandler(async (req, res) => {
    const { url, id, page, count } = req.query;
    const playlistIdOrUrl = (url as string) || (id as string);
    if (!playlistIdOrUrl) throw new Error('URL or ID is required');
    const result = await Tiktok.Playlist(playlistIdOrUrl, {
        page: page ? Number(page) : 1,
        count: count ? Number(count) : 10
    });
    res.json(result);
}));

app.get('/api/trending', asyncHandler(async (req, res) => {
    const { type } = req.query;
    if (type === 'creators') {
        const result = await Tiktok.TrendingCreators();
        res.json(result);
    } else {
        const result = await Tiktok.Trending();
        res.json(result);
    }
}));

app.get('/api/music/videos', asyncHandler(async (req, res) => {
    const { url, id, page, count } = req.query;
    const musicIdOrUrl = (url as string) || (id as string);
    if (!musicIdOrUrl) throw new Error('URL or ID is required');
    const result = await Tiktok.GetVideosByMusicId(musicIdOrUrl, {
        page: page ? Number(page) : 1,
        count: count ? Number(count) : 30
    });
    res.json(result);
}));

app.get('/api/music/detail', asyncHandler(async (req, res) => {
    const { url, id } = req.query;
    const cookie = getCookie(req);
    const musicIdOrUrl = (url as string) || (id as string);
    if (!musicIdOrUrl) throw new Error('URL or ID is required');
    if (!cookie) throw new Error('Cookie is required for this endpoint');
    const result = await Tiktok.GetMusicDetail(musicIdOrUrl, {
        cookie: cookie as string
    });
    res.json(result);
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
