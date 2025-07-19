import express from 'express';

const router = express.Router();

// Test endpoint for SERP functionality
router.post('/test-search', async (req, res) => {
  try {
    const { keyword, location } = req.body;
    
    if (!keyword || !location) {
      return res.status(400).json({
        error: 'Keyword and location are required'
      });
    }

    // Mock response for now
    const results = {
      keyword,
      location: location.name || location,
      timestamp: new Date().toISOString(),
      organic: [
        {
          position: 1,
          title: 'Mock Result 1',
          url: 'https://example.com',
          snippet: 'This is a mock result for testing'
        },
        {
          position: 2,
          title: 'Mock Result 2',
          url: 'https://example2.com',
          snippet: 'This is another mock result'
        }
      ],
      mapPack: [
        {
          position: 1,
          title: 'Local Business 1',
          address: '123 Main St, City, State'
        }
      ],
      totalResults: 1000000
    };

    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Test search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

// Get queue statistics
router.get('/queue-stats', async (req, res) => {
  try {
    const stats = {
      waiting: 0,
      active: 0,
      completed: 5,
      failed: 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting queue stats:', error);
    res.status(500).json({
      error: 'Failed to get queue stats',
      message: error.message
    });
  }
});

export default router;