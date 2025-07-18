import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import {useClient} from '../context/ClientContext';

const {FiTrendingUp, FiTrendingDown, FiMinus, FiMapPin, FiMoreVertical, FiLoader} = FiIcons;

const KeywordTable = ({searchTerm}) => {
  const [sortBy, setSortBy] = useState('keyword');
  const [sortOrder, setSortOrder] = useState('asc');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {currentClient} = useClient();

  useEffect(() => {
    const fetchKeywords = async () => {
      if (!currentClient) {
        setKeywords([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch keywords with their location tracking information
        const {data, error} = await supabase
          .from('keywords_seo_87a5cd9f')
          .select(`
            *,
            keyword_location_tracking_seo_87a5cd9f!inner (
              id,
              location_id,
              is_active,
              locations_seo_87a5cd9f (
                name,
                city,
                state
              )
            )
          `)
          .eq('client_id', currentClient.id)
          .eq('keyword_location_tracking_seo_87a5cd9f.is_active', true);

        if (error) throw error;

        // Transform data to match our component's expected format
        const transformedData = (data || []).map(item => {
          const tracking = item.keyword_location_tracking_seo_87a5cd9f[0];
          const location = tracking?.locations_seo_87a5cd9f;
          
          return {
            id: item.id,
            keyword: item.keyword,
            location: location ? `${location.name}${location.city ? ', ' + location.city : ''}${location.state ? ', ' + location.state : ''}` : 'Unknown Location',
            currentRank: Math.floor(Math.random() * 10) + 1, // Random ranking for demo
            previousRank: Math.floor(Math.random() * 10) + 1,
            change: 0, // Will calculate below
            trend: 'stable', // Will calculate below
            searchVolume: item.search_volume || 0,
            mapPack: Math.random() > 0.5, // Random for demo
            trackingId: tracking?.id
          };
        });

        // Calculate changes and trends
        transformedData.forEach(item => {
          item.change = item.previousRank - item.currentRank;
          item.trend = item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'stable';
        });

        setKeywords(transformedData);
      } catch (err) {
        console.error('Error fetching keywords:', err);
        setError('Failed to load keywords');
      } finally {
        setLoading(false);
      }
    };

    fetchKeywords();
  }, [currentClient]);

  const filteredKeywords = keywords.filter(keyword =>
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keyword.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend) => {
    if (trend === 'up') return FiTrendingUp;
    if (trend === 'down') return FiTrendingDown;
    return FiMinus;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  const getRankColor = (rank) => {
    if (rank <= 3) return 'bg-green-100 text-green-800';
    if (rank <= 6) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <SafeIcon icon={FiLoader} className="animate-spin text-blue-500 text-2xl mr-3" />
        <p className="text-gray-600">Loading keywords...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!currentClient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a client to view keywords</p>
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No keywords found. Add some keywords to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Keyword</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Current Rank</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Change</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Search Volume</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Map Pack</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredKeywords.map((keyword, index) => (
            <motion.tr
              key={keyword.id}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.3, delay: index * 0.05}}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="font-medium text-gray-800">{keyword.keyword}</div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="text-gray-500 text-sm" />
                  <span className="text-gray-600">{keyword.location}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRankColor(keyword.currentRank)}`}>
                  #{keyword.currentRank}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <SafeIcon icon={getTrendIcon(keyword.trend)} className={`text-sm ${getTrendColor(keyword.trend)}`} />
                  <span className={`text-sm font-medium ${getTrendColor(keyword.trend)}`}>
                    {keyword.change > 0 ? '+' : ''}{keyword.change}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-center text-gray-600">
                {keyword.searchVolume.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  keyword.mapPack ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {keyword.mapPack ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <SafeIcon icon={FiMoreVertical} className="text-gray-500" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordTable;