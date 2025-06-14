-- Enable RLS on listings table if not already enabled
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Allow sellers to read all active listings
CREATE POLICY "Sellers can view all active listings" ON listings
  FOR SELECT
  TO authenticated
  USING (
    status = 'ACTIVE' AND
    EXISTS (
      SELECT 1 FROM seller_profiles 
      WHERE seller_profiles.user_id = auth.uid()
    )
  );

-- Allow buyers to read their own listings
CREATE POLICY "Buyers can view their own listings" ON listings
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

-- Allow buyers to create listings
CREATE POLICY "Buyers can create listings" ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    buyer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM buyer_profiles 
      WHERE buyer_profiles.user_id = auth.uid()
    )
  );

-- Allow buyers to update their own listings
CREATE POLICY "Buyers can update their own listings" ON listings
  FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());
