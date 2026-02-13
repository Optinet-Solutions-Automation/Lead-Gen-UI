# Google Lead Generation - React + Vite

A React-based lead generation form with n8n webhook integration.

## Features

- React + Vite for fast development
- Bootstrap 5 for UI components
- Real-time status polling
- Loading, success, and error modals
- Vercel serverless API functions

## Development

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for production
```bash
npm run build
```

## Deployment

This project is configured for Vercel deployment.

### Deploy to Vercel
1. Push to GitHub
2. Connect your repo to Vercel
3. Vercel will auto-deploy on every push

### n8n Integration

Update your n8n workflow to send status updates to:
```
https://your-domain.vercel.app/api/webhook-receiver
```

**Success payload:**
```json
{
  "status": "success",
  "message": "Lead processed successfully"
}
```

**Error payload:**
```json
{
  "status": "error",
  "message": "{{ $json.error.message }}",
  "failed_node": "{{ $json.error.node.name }}"
}
```

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── webhook-receiver.js # Receives status from n8n
│   └── check-status.js     # Frontend polls this for status
├── src/
│   ├── components/         # React components
│   │   ├── LeadGenForm.jsx
│   │   ├── LoadingModal.jsx
│   │   ├── SuccessModal.jsx
│   │   └── ErrorModal.jsx
│   ├── config/
│   │   └── countries.js    # Country configuration
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index-react.html        # Vite entry point
├── package.json
├── vite.config.js
└── vercel.json            # Vercel configuration
```

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
CANADA_PROFILEID=697b1b609a01a2ed8d8792ca
GERMANY_PROFILEID=TBC
NEWZEALAND_PROFILEID=TBC
AUSTRIA_PROFILEID=TBC
NORWAY_PROFILEID=TBC
```
