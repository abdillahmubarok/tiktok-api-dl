# Deploying to Vercel

This project is now configured to be deployed as a serverless API on Vercel.

## Prerequisites

1.  **Vercel CLI**: Install it via `npm i -g vercel`.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).

## Deployment Steps

1.  **Login to Vercel**:
    ```bash
    vercel login
    ```

2.  **Deploy**:
    Run the following command in the project root:
    ```bash
    vercel
    ```
    -   Accept default settings for most options.
    -   When asked "Want to modify these settings?", say **No**.

3.  **Production Deployment**:
    To deploy to production:
    ```bash
    vercel --prod
    ```

## API Endpoints

Once deployed, your API will be available at `https://<your-project>.vercel.app`.

Example endpoints:

*   **Download Video**:
    `GET /dl?url=https://www.tiktok.com/@user/video/1234567890`

*   **Search User**:
    `GET /search?keyword=tiktok&type=user`

*   **Get User Posts**:
    `GET /posts?username=tiktok`

*   **Get User Liked Videos**:
    `GET /liked?username=tiktok&cookie=YOUR_TIKTOK_COOKIE`

*   **Get Music Videos**:
    `GET /music/videos?id=1234567890`

## Configuration

*   **Runtime**: The project is configured to use the Node.js runtime (via `api/index.ts`).
*   **Routing**: `vercel.json` rewrites all requests to the API handler.
*   **Scripts**: The `helper/` scripts (signature generation) are embedded directly into the code to avoid file system issues in the serverless environment.
