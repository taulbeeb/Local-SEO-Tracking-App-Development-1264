import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

class SupabaseService {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async getActiveTrackingPairs() {
    try {
      const { data, error } = await this.supabase
        .from('keyword_location_tracking_seo_87a5cd9f')
        .select(`
          id,
          keyword_id,
          location_id,
          keywords_seo_87a5cd9f!inner (
            id,
            keyword,
            client_id
          ),
          locations_seo_87a5cd9f!inner (
            id,
            name,
            latitude,
            longitude,
            client_id
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      return data.map(item => ({
        trackingId: item.id,
        keywordId: item.keyword_id,
        keyword: item.keywords_seo_87a5cd9f.keyword,
        locationId: item.location_id,
        location: {
          name: item.locations_seo_87a5cd9f.name,
          lat: item.locations_seo_87a5cd9f.latitude,
          lng: item.locations_seo_87a5cd9f.longitude
        },
        clientId: item.keywords_seo_87a5cd9f.client_id
      }));
    } catch (error) {
      console.error('Error fetching active tracking pairs:', error);
      throw error;
    }
  }

  async saveTrackingResults(keywordId, locationId, clientId, results) {
    try {
      // Get the tracking pair ID
      const { data: trackingPair, error: trackingError } = await this.supabase
        .from('keyword_location_tracking_seo_87a5cd9f')
        .select('id')
        .eq('keyword_id', keywordId)
        .eq('location_id', locationId)
        .single();

      if (trackingError) throw trackingError;

      // Save organic results
      const organicPromises = results.organic.map((result, index) => {
        return this.supabase
          .from('rankings_seo_87a5cd9f')
          .insert({
            keyword_location_id: trackingPair.id,
            rank: result.position,
            url_ranking: result.url,
            map_pack_present: results.mapPack.length > 0,
            date_checked: new Date().toISOString().split('T')[0]
          });
      });

      await Promise.all(organicPromises);

      // Save map pack results if any
      if (results.mapPack.length > 0) {
        const mapPackPromises = results.mapPack.map((result) => {
          return this.supabase
            .from('rankings_seo_87a5cd9f')
            .insert({
              keyword_location_id: trackingPair.id,
              rank: result.position,
              map_pack_present: true,
              map_pack_position: result.position,
              date_checked: new Date().toISOString().split('T')[0]
            });
        });

        await Promise.all(mapPackPromises);
      }

      console.log(`Saved ${results.organic.length} organic results and ${results.mapPack.length} map pack results`);
    } catch (error) {
      console.error('Error saving tracking results:', error);
      throw error;
    }
  }

  async getClientKeywords(clientId) {
    try {
      const { data, error } = await this.supabase
        .from('keywords_seo_87a5cd9f')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client keywords:', error);
      throw error;
    }
  }

  async getClientLocations(clientId) {
    try {
      const { data, error } = await this.supabase
        .from('locations_seo_87a5cd9f')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client locations:', error);
      throw error;
    }
  }
}

export default new SupabaseService();