# Setting Up Upstash Redis (Free)

The webhook system requires Upstash Redis to store status data between serverless function calls. Follow these steps:

## 1. Create Upstash Account

1. Go to [https://console.upstash.com](https://console.upstash.com)
2. Sign up for a free account (no credit card required)
3. Verify your email

## 2. Create Redis Database

1. Click "Create Database"
2. Choose:
   - **Name**: `lead-gen-status` (or any name you prefer)
   - **Type**: Regional
   - **Region**: Choose the region closest to your users
   - **Eviction**: No eviction
3. Click "Create"

## 3. Get Connection Credentials

1. After creation, you'll see your database dashboard
2. Scroll down to "REST API" section
3. Copy these two values:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**

## 4. Add to Environment Variables

### Local Development (.env file)

Update your `.env` file:
```env
UPSTASH_REDIS_REST_URL=https://your-database-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add two variables:
   - Name: `UPSTASH_REDIS_REST_URL`, Value: `https://your-database-url.upstash.io`
   - Name: `UPSTASH_REDIS_REST_TOKEN`, Value: `your_token_here`
4. Select all environments (Production, Preview, Development)
5. Click "Save"

## 5. Install Dependencies

Run in your project directory:
```bash
npm install
```

This will install the `@upstash/redis` package added to package.json.

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Submit a test form
3. Trigger your n8n workflow to send a status update
4. The loading modal should close and show success/error modal

## Why Upstash Redis?

- **Free tier**: 10,000 commands/day, more than enough for this use case
- **Serverless-friendly**: Works perfectly with Vercel serverless functions
- **No connection pooling needed**: Uses HTTP REST API
- **Fast**: Low latency, works globally
- **Automatic expiration**: Status data auto-deletes after 5 minutes

## Troubleshooting

**"Error storing status" in logs:**
- Check that environment variables are set correctly
- Verify the URL and token are correct
- Make sure there are no extra spaces in the values

**Still stuck in loading:**
- Check Vercel function logs for errors
- Verify n8n is sending the webhook to the correct URL
- Check that the webhook payload includes `"status": "success"` or `"status": "error"`
