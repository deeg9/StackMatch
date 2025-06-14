-- Create Proposal Requests Table
CREATE TABLE proposal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  seller_id UUID REFERENCES seller_profiles(user_id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  timeline_days INTEGER,
  deadline TIMESTAMP WITH TIME ZONE,
  urgency_level VARCHAR(20) DEFAULT 'MEDIUM' CHECK (urgency_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  required_skills TEXT[],
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESPONDED', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Proposal Responses Table
CREATE TABLE proposal_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES proposal_requests(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  timeline_days INTEGER NOT NULL,
  scope_description TEXT NOT NULL,
  terms_conditions TEXT,
  validity_period_days INTEGER DEFAULT 30,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'REVISED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Proposal Response Milestones
CREATE TABLE proposal_response_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES proposal_responses(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Proposal Request Files
CREATE TABLE proposal_request_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES proposal_requests(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Proposal Response Files
CREATE TABLE proposal_response_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES proposal_responses(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_proposal_requests_buyer_id ON proposal_requests(buyer_id);
CREATE INDEX idx_proposal_requests_seller_id ON proposal_requests(seller_id);
CREATE INDEX idx_proposal_requests_status ON proposal_requests(status);
CREATE INDEX idx_proposal_requests_created_at ON proposal_requests(created_at);
CREATE INDEX idx_proposal_responses_request_id ON proposal_responses(request_id);
CREATE INDEX idx_proposal_responses_status ON proposal_responses(status);

-- Add RLS policies
ALTER TABLE proposal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_response_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_request_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_response_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proposal_requests
CREATE POLICY "Users can view proposal requests they're involved in" ON proposal_requests
  FOR SELECT USING (
    buyer_id = auth.uid() OR 
    seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Buyers can create proposal requests" ON proposal_requests
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update their own proposal requests" ON proposal_requests
  FOR UPDATE USING (buyer_id = auth.uid());

CREATE POLICY "Buyers can delete their own proposal requests" ON proposal_requests
  FOR DELETE USING (buyer_id = auth.uid());

-- RLS Policies for proposal_responses
CREATE POLICY "Users can view responses to their requests" ON proposal_responses
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM proposal_requests 
      WHERE buyer_id = auth.uid() OR 
      seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Sellers can create responses to requests sent to them" ON proposal_responses
  FOR INSERT WITH CHECK (
    request_id IN (
      SELECT id FROM proposal_requests 
      WHERE seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Sellers can update their own responses" ON proposal_responses
  FOR UPDATE USING (
    request_id IN (
      SELECT id FROM proposal_requests 
      WHERE seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for milestones
CREATE POLICY "Users can view milestones for their responses" ON proposal_response_milestones
  FOR SELECT USING (
    response_id IN (
      SELECT pr.id FROM proposal_responses pr
      JOIN proposal_requests req ON pr.request_id = req.id
      WHERE req.buyer_id = auth.uid() OR 
      req.seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Sellers can manage milestones for their responses" ON proposal_response_milestones
  FOR ALL USING (
    response_id IN (
      SELECT pr.id FROM proposal_responses pr
      JOIN proposal_requests req ON pr.request_id = req.id
      WHERE req.seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for files
CREATE POLICY "Users can view files for their requests/responses" ON proposal_request_files
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM proposal_requests 
      WHERE buyer_id = auth.uid() OR 
      seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload files to their requests" ON proposal_request_files
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    request_id IN (
      SELECT id FROM proposal_requests 
      WHERE buyer_id = auth.uid()
    )
  );

CREATE POLICY "Users can view response files" ON proposal_response_files
  FOR SELECT USING (
    response_id IN (
      SELECT pr.id FROM proposal_responses pr
      JOIN proposal_requests req ON pr.request_id = req.id
      WHERE req.buyer_id = auth.uid() OR 
      req.seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Sellers can upload files to their responses" ON proposal_response_files
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    response_id IN (
      SELECT pr.id FROM proposal_responses pr
      JOIN proposal_requests req ON pr.request_id = req.id
      WHERE req.seller_id IN (SELECT user_id FROM seller_profiles WHERE user_id = auth.uid())
    )
  );
