# LocalSEO Pro - SERP Tracking Application

A comprehensive local SEO tracking application with automated SERP scraping capabilities using Puppeteer.

## Features

- 🔍 **SERP Scraping**: Automated Google search result tracking using Puppeteer
- 📊 **Multi-Client Management**: Manage multiple clients and their SEO campaigns
- 📍 **Location-Based Tracking**: Track rankings across different geographic locations
- 🎯 **Keyword Monitoring**: Monitor keyword rankings and map pack appearances
- 📈 **Performance Analytics**: Detailed charts and metrics for ranking performance
- ⚡ **Queue Management**: Efficient job processing with Redis-backed queues
- 🔒 **Secure Authentication**: Supabase-powered user authentication and data management

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Leaflet for maps
- ECharts for data visualization

### Backend
- Node.js with Express
- Puppeteer for web scraping
- Bull.js for job queues
- Redis for queue management
- Supabase for database and authentication

## Getting Started

### Prerequisites
- Node.js 18+
- Redis server
- Supabase account

### Local Development

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd local-seo-tracker
npm install
```

2. **Environment Setup:**
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

3. **Start Redis:**
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally on macOS
brew install redis
brew services start redis
```

4. **Run the application:**
```bash
# Start frontend development server
npm run dev

# In another terminal, start the backend server
npm run dev:server
```

## Railway Deployment

### 1. Connect Supabase Project
First, connect your Supabase project using the tools available in the app.

### 2. Railway Setup

1. **Create Railway Project:**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo

2. **Add Redis:**
   - In Railway dashboard, click "New"
   - Select "Database" → "Redis"
   - Note the connection details

3. **Configure Environment Variables:**
   ```env
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   REDIS_URL=redis://default:password@host:port
   ```

4. **Deploy:**
   - Railway will automatically build and deploy
   - The app serves both frontend and backend from a single service

### 3. Custom Domain (Optional)
- In Railway project settings, add your custom domain
- Update CORS settings if needed

## API Endpoints

### SERP Routes
- `POST /api/serp/test-search` - Test single keyword search
- `POST /api/serp/track` - Add keyword to tracking queue
- `GET /api/serp/queue-stats` - Get queue statistics
- `POST /api/serp/schedule-all/:clientId` - Schedule all tracking for a client

### Tracking Routes
- `GET /api/tracking/results/:clientId` - Get tracking results
- `GET /api/tracking/trends/:keywordId/:locationId` - Get ranking trends

## Usage

### 1. Set Up Clients
- Add your clients through the Clients page
- Configure client settings and API keys

### 2. Add Locations and Keywords
- Define geographic locations to track
- Add relevant keywords for each client

### 3. Start Tracking
- Use the SERP test tool to verify functionality
- Schedule automated tracking jobs
- Monitor queue status and results

### 4. Analyze Results
- View ranking trends and performance metrics
- Generate reports for clients
- Track map pack appearances and organic rankings

## Monitoring and Maintenance

### Queue Monitoring
- Monitor queue stats through the dashboard
- Check logs for failed jobs
- Adjust rate limiting as needed

### Database Maintenance
- Regular cleanup of old ranking data
- Monitor Supabase usage and limits
- Backup important client data

### SERP Scraping Best Practices
- Respect rate limits to avoid IP blocking
- Monitor for Google layout changes
- Use residential proxies for production (optional)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the GitHub issues
- Review Railway deployment logs
- Monitor Supabase logs for database issues