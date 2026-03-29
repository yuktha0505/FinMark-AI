"# FinMark Sentinel AI Dashboard

A clean, modern enterprise dashboard for AI-powered financial transaction anomaly detection.

## Features

- **Anomaly Detection Control**: Trigger AI-powered transaction analysis
- **AI Analysis Panel**: View root cause, reasoning steps, confidence score, and financial impact
- **Action Panel**: Review and approve suggested corrective actions
- **System Status**: Real-time monitoring of system health and action status
- **Dark Mode UI**: Professional enterprise SaaS design with blue accents

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Shadcn/UI
- **Icons**: Lucide React
- **Fonts**: Outfit (headings), IBM Plex Sans (body), JetBrains Mono (metrics)
- **Backend API**: External service at port 8080

## Setup Instructions

### 1. Environment Variables

The dashboard requires the backend API URL to be configured. Update `/app/frontend/.env`:

```env
REACT_APP_ANOMALY_API_URL=http://localhost:8080/api/anomaly/trigger
```

### 2. Backend API Configuration

⚠️ **Important CORS & Security Note**:

Due to browser security restrictions, the frontend cannot directly call `localhost:8080` from a remote deployment (like `https://transaction-monitor-7.preview.emergentagent.com`). This is a security feature that prevents websites from accessing local services.

**Solutions**:

1. **Public Backend URL** (Recommended for production):
   - Deploy your backend API to a public URL
   - Update `REACT_APP_ANOMALY_API_URL` to point to the public URL
   - Example: `REACT_APP_ANOMALY_API_URL=https://api.example.com/api/anomaly/trigger`

2. **Local Development**:
   - Run both frontend and backend locally
   - Frontend: `cd /app/frontend && yarn start`
   - Backend: Your existing service at `http://localhost:8080`

3. **Tunneling** (Quick testing):
   - Use ngrok or similar to expose localhost:8080 publicly
   - Example: `ngrok http 8080`
   - Update env variable with the ngrok URL

### 3. Expected Backend API Response

The backend should return JSON in this format:

```json
{
  \"analysis\": {
    \"root_cause\": \"Payment gateway timeout spike detected\",
    \"reasoning_steps\": [
      \"Analyzed 50K transactions in last hour\",
      \"Detected 12% failure rate vs 2% baseline\",
      \"Root cause: Gateway A processing delays\"
    ],
    \"confidence\": 0.87,
    \"financial_impact\": \"₹1.2L/day\"
  },
  \"playbook\": {
    \"actions\": [
      {
        \"type\": \"reroute\",
        \"target\": \"Gateway B\",
        \"expected_impact\": \"+3%\"
      }
    ]
  }
}
```

## Running the Application

### Frontend Only (Current Setup)
```bash
cd /app/frontend
yarn install
yarn start
```

The app will be available at `http://localhost:3000` or your deployment URL.

### Full Stack (With Backend)
Ensure your backend is running on port 8080 and accessible from the frontend environment.

## Design System

- **Theme**: Dark Mode Enterprise SaaS
- **Colors**:
  - Background: Slate-950
  - Surface: Slate-900
  - Primary: Blue-600
  - Status Colors: Emerald (stable), Rose (anomaly), Amber (warning)
- **Typography**:
  - Headings: Outfit
  - Body: IBM Plex Sans
  - Metrics: JetBrains Mono

## Troubleshooting

### \"Failed to fetch\" Error

This usually means:
1. Backend is not running
2. Backend URL is incorrect in `.env`
3. CORS is blocking the request (see Backend API Configuration above)
4. Network/firewall blocking the connection

Check browser console for detailed error messages.

### Styling Issues

If styles don't load:
1. Ensure Tailwind CSS is properly configured
2. Verify Google Fonts are loading (check Network tab)
3. Clear browser cache

## Development

The codebase follows best practices:
- All interactive elements have `data-testid` attributes for testing
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Clean component structure

## License

MIT
"