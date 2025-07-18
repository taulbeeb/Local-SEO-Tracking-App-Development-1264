-- Create database schema for multi-client local SEO tracking system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE users_seo_87a5cd9f (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE clients_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_contact TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users_seo_87a5cd9f(id)
);

-- Create user_client_access table for managing access rights
CREATE TABLE user_client_access_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users_seo_87a5cd9f(id) NOT NULL,
  client_id UUID REFERENCES clients_seo_87a5cd9f(id) NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, client_id)
);

-- Create client_api_keys table to store API keys per client
CREATE TABLE client_api_keys_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients_seo_87a5cd9f(id) NOT NULL,
  service_name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, service_name)
);

-- Create locations table
CREATE TABLE locations_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients_seo_87a5cd9f(id) NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  radius_miles INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keywords table
CREATE TABLE keywords_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients_seo_87a5cd9f(id) NOT NULL,
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, keyword)
);

-- Create keyword_location_tracking table
CREATE TABLE keyword_location_tracking_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword_id UUID REFERENCES keywords_seo_87a5cd9f(id) NOT NULL,
  location_id UUID REFERENCES locations_seo_87a5cd9f(id) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  tracking_frequency TEXT DEFAULT 'weekly' CHECK (tracking_frequency IN ('daily', 'weekly', 'monthly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(keyword_id, location_id)
);

-- Create rankings table
CREATE TABLE rankings_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword_location_id UUID REFERENCES keyword_location_tracking_seo_87a5cd9f(id) NOT NULL,
  rank INTEGER NOT NULL,
  previous_rank INTEGER,
  map_pack_present BOOLEAN DEFAULT FALSE,
  map_pack_position INTEGER,
  date_checked DATE NOT NULL,
  url_ranking TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competitors table
CREATE TABLE competitors_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients_seo_87a5cd9f(id) NOT NULL,
  name TEXT NOT NULL,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competitor_rankings table
CREATE TABLE competitor_rankings_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID REFERENCES competitors_seo_87a5cd9f(id) NOT NULL,
  keyword_location_id UUID REFERENCES keyword_location_tracking_seo_87a5cd9f(id) NOT NULL,
  rank INTEGER NOT NULL,
  date_checked DATE NOT NULL,
  url_ranking TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE reports_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients_seo_87a5cd9f(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('performance', 'keyword', 'location', 'competitor', 'custom')),
  parameters JSONB,
  file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'ready', 'failed')),
  created_by UUID REFERENCES users_seo_87a5cd9f(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_reports table
CREATE TABLE scheduled_reports_seo_87a5cd9f (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients_seo_87a5cd9f(id) NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('performance', 'keyword', 'location', 'competitor', 'custom')),
  parameters JSONB,
  schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly')),
  next_run TIMESTAMP WITH TIME ZONE,
  last_run TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users_seo_87a5cd9f(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS policies
ALTER TABLE users_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_client_access_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_api_keys_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_location_tracking_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_rankings_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports_seo_87a5cd9f ENABLE ROW LEVEL SECURITY;

-- Create policies for users to access their own data
CREATE POLICY "Users can view their own data" ON users_seo_87a5cd9f
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users_seo_87a5cd9f
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for client access
CREATE POLICY "Users can view clients they have access to" ON clients_seo_87a5cd9f
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_client_access_seo_87a5cd9f
      WHERE user_id = auth.uid() AND client_id = clients_seo_87a5cd9f.id
    )
  );

CREATE POLICY "Users can create clients" ON clients_seo_87a5cd9f
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update clients they have admin access to" ON clients_seo_87a5cd9f
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_client_access_seo_87a5cd9f
      WHERE user_id = auth.uid() AND client_id = clients_seo_87a5cd9f.id AND access_level = 'admin'
    )
  );

-- Create policies for user_client_access
CREATE POLICY "Admins can manage user access" ON user_client_access_seo_87a5cd9f
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_client_access_seo_87a5cd9f
      WHERE user_id = auth.uid() AND client_id = user_client_access_seo_87a5cd9f.client_id AND access_level = 'admin'
    )
  );

CREATE POLICY "Users can view their own access" ON user_client_access_seo_87a5cd9f
  FOR SELECT USING (user_id = auth.uid());

-- Create policies for API keys
CREATE POLICY "Users can view API keys for clients they have access to" ON client_api_keys_seo_87a5cd9f
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_client_access_seo_87a5cd9f
      WHERE user_id = auth.uid() AND client_id = client_api_keys_seo_87a5cd9f.client_id
    )
  );

CREATE POLICY "Users can manage API keys for clients they have admin access to" ON client_api_keys_seo_87a5cd9f
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_client_access_seo_87a5cd9f
      WHERE user_id = auth.uid() AND client_id = client_api_keys_seo_87a5cd9f.client_id AND access_level IN ('admin', 'editor')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_user_client_access_user_id ON user_client_access_seo_87a5cd9f(user_id);
CREATE INDEX idx_user_client_access_client_id ON user_client_access_seo_87a5cd9f(client_id);
CREATE INDEX idx_locations_client_id ON locations_seo_87a5cd9f(client_id);
CREATE INDEX idx_keywords_client_id ON keywords_seo_87a5cd9f(client_id);
CREATE INDEX idx_rankings_keyword_location_id ON rankings_seo_87a5cd9f(keyword_location_id);
CREATE INDEX idx_rankings_date_checked ON rankings_seo_87a5cd9f(date_checked);
CREATE INDEX idx_reports_client_id ON reports_seo_87a5cd9f(client_id);

-- Add functions to automatically set created_by for clients
CREATE OR REPLACE FUNCTION set_client_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_client_created_by_trigger
BEFORE INSERT ON clients_seo_87a5cd9f
FOR EACH ROW
EXECUTE FUNCTION set_client_created_by();

-- Add functions to automatically add admin access for the user creating a client
CREATE OR REPLACE FUNCTION add_admin_access_for_creator()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_client_access_seo_87a5cd9f (user_id, client_id, access_level)
  VALUES (NEW.created_by, NEW.id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_admin_access_trigger
AFTER INSERT ON clients_seo_87a5cd9f
FOR EACH ROW
EXECUTE FUNCTION add_admin_access_for_creator();