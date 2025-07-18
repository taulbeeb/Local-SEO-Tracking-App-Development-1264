import express from 'express';
import supabaseService from '../services/supabaseService.js';

const router = express.Router();

// Get tracking results for a client
router.get('/results/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { startDate, endDate, keywordId, locationId } = req.query;

    let query = supabaseService.supabase
      .from('rankings_seo_87a5cd9f')
      .select(`
        *,
        keyword_location_tracking_seo_87a5cd9f!inner (
          keywords_seo_87a5cd9f!inner (
            keyword,
            client_id
          ),
          locations_seo_87a5cd9f!inner (
            name
          )
        )
      `)
      .eq('keyword_location_tracking_seo_87a5cd9f.keywords_seo_87a5cd9f.client_id', clientId);

    if (startDate) {
      query = query.gte('date_checked', startDate);
    }
    
    if (endDate) {
      query = query.lte('date_checked', endDate);
    }

    if (keywordId) {
      query = query.eq('keyword_location_tracking_seo_87a5cd9f.keyword_id', keywordId);
    }

    if (locationId) {
      query = query.eq('keyword_location_tracking_seo_87a5cd9f.location_id', locationId);
    }

    const { data, error } = await query.order('date_checked', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching tracking results:', error);
    res.status(500).json({ error: 'Failed to fetch results', message: error.message });
  }
});

// Get ranking trends for a specific keyword-location pair
router.get('/trends/:keywordId/:locationId', async (req, res) => {
  try {
    const { keywordId, locationId } = req.params;
    const { days = 30 } = req.query;

    const { data: trackingPair, error: trackingError } = await supabaseService.supabase
      .from('keyword_location_tracking_seo_87a5cd9f')
      .select('id')
      .eq('keyword_id', keywordId)
      .eq('location_id', locationId)
      .single();

    if (trackingError) throw trackingError;

    const { data, error } = await supabaseService.supabase
      .from('rankings_seo_87a5cd9f')
      .select('*')
      .eq('keyword_location_id', trackingPair.id)
      .gte('date_checked', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date_checked', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ranking trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends', message: error.message });
  }
});

export default router;