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

#Design system

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
