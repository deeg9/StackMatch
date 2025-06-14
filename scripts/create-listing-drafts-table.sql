-- Create listing_drafts table for saving guided listing progress
CREATE TABLE IF NOT EXISTS listing_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  form_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listing_drafts_user_id ON listing_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_drafts_category ON listing_drafts(category);
CREATE INDEX IF NOT EXISTS idx_listing_drafts_updated_at ON listing_drafts(updated_at);

-- Enable RLS
ALTER TABLE listing_drafts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own drafts" ON listing_drafts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts" ON listing_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" ON listing_drafts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" ON listing_drafts
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_listing_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_listing_drafts_updated_at
  BEFORE UPDATE ON listing_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_drafts_updated_at();
