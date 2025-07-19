import express from 'express';

const router = express.Router();

// Get tracking results for a client
router.get('/results/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Mock response for now
    const data = [
      {
        id: '1',
        keyword: 'pizza delivery',
        location: 'Manhattan, NY',
        currentRank: 2,
        previousRank: 3,
        change: 1,
        date_checked: new Date().toISOString().split('T')[0]
      }
    ];

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching tracking results:', error);
    res.status(500).json({
      error: 'Failed to fetch results',
      message: error.message
    });
  }
});

export default router;