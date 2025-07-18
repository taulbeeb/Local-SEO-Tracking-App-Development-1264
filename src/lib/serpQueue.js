import Bull from 'bull';
import Redis from 'ioredis';

const serpQueue = new Bull('serp-tracking', {
  redis: {
    port: 6379,
    host: 'localhost'
  },
  limiter: {
    max: 60,    // Maximum jobs per time window
    duration: 3600000  // Time window in ms (1 hour)
  }
});

serpQueue.process(async (job) => {
  const { keyword, location } = job.data;
  const scraper = new AdvancedSerpScraper();
  return await scraper.searchGoogle(keyword, location);
});