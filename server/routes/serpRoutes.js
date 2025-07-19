import express from 'express';
import queueService from '../services/queueService.js';
import serpService from '../services/serpService.js';
import supabaseService from '../services/supabaseService.js';

const router = express.Router();

// Test single keyword tracking
router.post('/test-search', async (req, res) => {
  try {
    const { keyword, location } = req.body;
    
    if (!keyword || !location) {
      return res.status(400).json({ error: 'Keyword and location are required' });
    }

    const results = await serpService.searchGoogle(keyword, location);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Test search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

// Add keyword to tracking queue
router.post('/track', async (req, res) => {
  try {
    const { keywordId, keyword, locationId, location, clientId, priority = 'normal' } = req.body;
    
    const job = await queueService.addTrackingJob({
      keywordId,
      keyword,
      locationId,
      location,
      clientId
    }, priority);

    res.json({
      success: true,
      jobId: job.id,
      message: 'Tracking job added to queue'
    });
  } catch (error) {
    console.error('Error adding tracking job:', error);
    res.status(500).json({ error: 'Failed to add tracking job', message: error.message });
  }
});

// Get queue statistics
router.get('/queue-stats', async (req, res) => {
  try {
    const stats = await queueService.getQueueStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting queue stats:', error);
    res.status(500).json({ error: 'Failed to get queue stats', message: error.message });
  }
});

// Schedule all tracking for a client
router.post('/schedule-all/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Get all keyword-location pairs for this client
    const keywords = await supabaseService.getClientKeywords(clientId);
    const locations = await supabaseService.getClientLocations(clientId);
    
    let jobCount = 0;
    
    // Create tracking jobs for each keyword-location combination
    for (const keyword of keywords) {
      for (const location of locations) {
        await queueService.addTrackingJob({
          keywordId: keyword.id,
          keyword: keyword.keyword,
          locationId: location.id,
          location: {
            name: location.name,
            lat: location.latitude,
            lng: location.longitude
          },
          clientId
        });
        jobCount++;
      }
    }

    res.json({
      success: true,
      message: `Scheduled ${jobCount} tracking jobs`,
      jobCount
    });
  } catch (error) {
    console.error('Error scheduling client tracking:', error);
    res.status(500).json({ error: 'Failed to schedule tracking', message: error.message });
  }
});

export default router;