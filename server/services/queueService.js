import Bull from 'bull';
import serpService from './serpService.js';
import supabaseService from './supabaseService.js';

class QueueService {
  constructor() {
    try {
      // Configure Redis connection with fallback for Railway
      const redisConfig = process.env.REDIS_URL 
        ? process.env.REDIS_URL 
        : {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD
          };

      console.log('Initializing Redis connection for queue service');

      // Create queue with error handling
      this.serpQueue = new Bull('serp-tracking', {
        redis: redisConfig,
        defaultJobOptions: {
          removeOnComplete: 10,
          removeOnFail: 5,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          }
        }
      });

      console.log('Queue initialized successfully');
      this.setupQueueProcessors();
      this.setupQueueEvents();
    } catch (error) {
      console.error('Error initializing queue service:', error);
      // Provide a fallback implementation to prevent crashes
      this.serpQueue = {
        process: () => {},
        on: () => {},
        add: async () => ({ id: 'mock-job' }),
        getWaiting: async () => [],
        getActive: async () => [],
        getCompleted: async () => [],
        getFailed: async () => [],
        close: async () => {}
      };
    }
  }

  setupQueueProcessors() {
    // Process SERP tracking jobs
    this.serpQueue.process('track-keyword', 2, async (job) => {
      const { keywordId, keyword, locationId, location, clientId } = job.data;
      
      try {
        console.log(`Processing SERP tracking for keyword: ${keyword} in ${location.name}`);
        
        // Perform the search
        const results = await serpService.searchGoogle(keyword, location);
        
        // Save results to database
        await supabaseService.saveTrackingResults(keywordId, locationId, clientId, results);
        
        return { success: true, results };
      } catch (error) {
        console.error('SERP tracking job failed:', error);
        throw error;
      }
    });
  }

  setupQueueEvents() {
    this.serpQueue.on('completed', (job, result) => {
      console.log(`Job ${job.id} completed for keyword: ${job.data.keyword}`);
    });

    this.serpQueue.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed:`, err.message);
    });

    this.serpQueue.on('stalled', (job) => {
      console.warn(`Job ${job.id} stalled`);
    });

    this.serpQueue.on('error', (error) => {
      console.error('Queue error:', error);
    });
  }

  async addTrackingJob(keywordData, priority = 'normal') {
    try {
      const jobOptions = {
        priority: priority === 'high' ? 1 : priority === 'low' ? 3 : 2,
        delay: this.calculateDelay(),
        attempts: 3,
        timeout: 60000 // 60 seconds timeout
      };

      const job = await this.serpQueue.add('track-keyword', keywordData, jobOptions);
      console.log(`Added tracking job ${job.id} for keyword: ${keywordData.keyword}`);
      return job;
    } catch (error) {
      console.error('Error adding tracking job:', error);
      throw error;
    }
  }

  async scheduleAllTracking() {
    try {
      // Get all active keyword-location pairs from database
      const trackingPairs = await supabaseService.getActiveTrackingPairs();
      
      console.log(`Scheduling ${trackingPairs.length} tracking jobs`);
      
      for (const pair of trackingPairs) {
        await this.addTrackingJob(pair, 'normal');
        // Add small delay between job additions to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`Scheduled ${trackingPairs.length} tracking jobs successfully`);
      return { success: true, count: trackingPairs.length };
    } catch (error) {
      console.error('Error scheduling tracking jobs:', error);
      throw error;
    }
  }

  calculateDelay() {
    // Add random delay between 0-30 seconds to spread out requests
    return Math.floor(Math.random() * 30000);
  }

  async getQueueStats() {
    try {
      const waiting = await this.serpQueue.getWaiting();
      const active = await this.serpQueue.getActive();
      const completed = await this.serpQueue.getCompleted();
      const failed = await this.serpQueue.getFailed();

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      // Return fallback stats to prevent UI errors
      return {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        error: error.message
      };
    }
  }

  async close() {
    try {
      await this.serpQueue.close();
      console.log('Queue closed successfully');
    } catch (error) {
      console.error('Error closing queue:', error);
    }
  }
}

export default new QueueService();