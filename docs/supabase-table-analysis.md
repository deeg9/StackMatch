# Supabase Tables Analysis

## Tables and Their Columns

### 1. **profiles**
Primary user profile table linked to auth.users
- **id** (uuid, PK, FK to auth.users.id)
- **email** (text, NOT NULL)
- **full_name** (text)
- **company_name** (text, nullable)
- **avatar_url** (text, nullable)
- **user_type** (enum: 'buyer' | 'seller', NOT NULL)
- **is_verified** (boolean, default false)
- **email_verified** (boolean, default false)
- **onboarding_completed** (boolean, default false)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 2. **buyer_profiles**
Extended profile for buyers
- **id** (uuid, PK)
- **user_id** (uuid, FK to profiles.id, UNIQUE, NOT NULL)
- **company_name** (text, nullable)
- **industry** (text, nullable)
- **company_size** (text, nullable)
- **website** (text, nullable)
- **is_verified_buyer** (boolean, default false)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 3. **seller_profiles**
Extended profile for sellers
- **id** (uuid, PK)
- **user_id** (uuid, FK to profiles.id, UNIQUE, NOT NULL)
- **business_type** (text, nullable)
- **years_experience** (integer, nullable)
- **specializations** (text[], nullable)
- **hourly_rate_min** (numeric, nullable)
- **hourly_rate_max** (numeric, nullable)
- **bio** (text, nullable)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 4. **listings**
Project listings created by buyers
- **id** (uuid, PK)
- **title** (text, NOT NULL)
- **description** (text, NOT NULL)
- **buyer_id** (uuid, FK to profiles.id, NOT NULL)
- **category_id** (uuid, FK to project_categories.id, nullable)
- **status** (enum: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED', default 'ACTIVE')
- **budget_min** (numeric, nullable)
- **budget_max** (numeric, nullable)
- **bid_deadline** (timestamptz, nullable)
- **project_start_date** (date, nullable)
- **project_duration** (text, nullable)
- **required_skills** (text[], nullable)
- **location_preference** (text, nullable)
- **remote_preference** (text, nullable)
- **about_company** (text, nullable)
- **about_business** (text, nullable)
- **attachments** (jsonb[], nullable) - Array of {url, name, size, type}
- **success_metrics** (text[], nullable)
- **current_challenges** (text[], nullable)
- **timeline_phases** (jsonb[], nullable)
- **view_count** (integer, default 0)
- **published_at** (timestamptz, nullable)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 5. **listing_requirements**
Detailed requirements for listings
- **id** (uuid, PK)
- **listing_id** (uuid, FK to listings.id, NOT NULL)
- **requirement** (text, NOT NULL)
- **priority** (enum: 'low' | 'medium' | 'high', default 'medium')
- **order_index** (integer, default 0)
- **created_at** (timestamptz)

### 6. **project_categories**
Categories for listings
- **id** (uuid, PK)
- **name** (text, NOT NULL, UNIQUE)
- **slug** (text, NOT NULL, UNIQUE)
- **description** (text, nullable)
- **parent_id** (uuid, FK to project_categories.id, nullable)
- **icon** (text, nullable)
- **is_active** (boolean, default true)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 7. **proposals**
Seller proposals for listings
- **id** (uuid, PK)
- **listing_id** (uuid, FK to listings.id, NOT NULL)
- **seller_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **cover_letter** (text, NOT NULL)
- **proposed_budget** (numeric, NOT NULL)
- **proposed_timeline** (text, nullable)
- **technical_approach** (text, nullable)
- **relevant_experience** (text, nullable)
- **status** (enum: 'DRAFT' | 'SUBMITTED' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED', default 'DRAFT')
- **is_sealed** (boolean, default false)
- **attachments** (jsonb[], nullable)
- **submitted_at** (timestamptz, nullable)
- **withdrawn_at** (timestamptz, nullable)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 8. **proposal_milestones**
Milestones for proposals
- **id** (uuid, PK)
- **proposal_id** (uuid, FK to proposals.id, NOT NULL)
- **title** (text, NOT NULL)
- **description** (text, nullable)
- **deliverables** (text[], nullable)
- **amount** (numeric, NOT NULL)
- **duration_days** (integer, nullable)
- **order_index** (integer, default 0)
- **created_at** (timestamptz)

### 9. **deal_rooms**
Deal rooms for accepted proposals
- **id** (uuid, PK)
- **listing_id** (uuid, FK to listings.id, nullable)
- **proposal_id** (uuid, FK to proposals.id, nullable)
- **buyer_id** (uuid, FK to profiles.id, NOT NULL)
- **seller_id** (uuid, FK to profiles.id, NOT NULL)
- **room_name** (text, nullable)
- **status** (enum: 'active' | 'pending_closure' | 'closed' | 'cancelled', default 'active')
- **created_at** (timestamptz)
- **completed_at** (timestamptz, nullable)
- **last_activity_at** (timestamptz, nullable)

### 10. **deal_room_participants**
Participants in deal rooms
- **id** (uuid, PK)
- **deal_room_id** (uuid, FK to deal_rooms.id, NOT NULL)
- **user_id** (uuid, FK to profiles.id, NOT NULL)
- **role** (enum: 'buyer' | 'seller' | 'observer', NOT NULL)
- **joined_at** (timestamptz, default now())
- **last_seen_at** (timestamptz, nullable)
- UNIQUE(deal_room_id, user_id)

### 11. **deal_room_messages**
Messages in deal rooms
- **id** (uuid, PK)
- **deal_room_id** (uuid, FK to deal_rooms.id, NOT NULL)
- **sender_id** (uuid, FK to profiles.id, NOT NULL)
- **content** (text, NOT NULL)
- **sender_type** (enum: 'text' | 'file' | 'system', default 'text')
- **created_at** (timestamptz)
- **updated_at** (timestamptz)
- **edited_at** (timestamptz, nullable)
- **is_deleted** (boolean, default false)

### 12. **deal_room_files**
Files uploaded to deal rooms
- **id** (uuid, PK)
- **deal_room_id** (uuid, FK to deal_rooms.id, NOT NULL)
- **uploader_id** (uuid, FK to profiles.id, NOT NULL)
- **file_name** (text, NOT NULL)
- **file_path** (text, NOT NULL) - Vercel Blob URL
- **file_size_bytes** (bigint, nullable)
- **mime_type** (text, nullable)
- **type** (text, nullable) - Category like 'CONTRACT', 'INVOICE', etc.
- **version** (integer, default 1)
- **is_latest** (boolean, default true)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 13. **conversations**
Chat conversations between users
- **id** (uuid, PK)
- **type** (enum: 'DIRECT' | 'LISTING_INQUIRY' | 'PROPOSAL_DISCUSSION', NOT NULL)
- **listing_id** (uuid, FK to listings.id, nullable)
- **proposal_id** (uuid, FK to proposals.id, nullable)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 14. **conversation_participants**
Participants in conversations
- **id** (uuid, PK)
- **conversation_id** (uuid, FK to conversations.id, NOT NULL)
- **user_id** (uuid, FK to profiles.id, NOT NULL)
- **last_read_at** (timestamptz, nullable)
- **is_archived** (boolean, default false)
- **joined_at** (timestamptz, default now())
- UNIQUE(conversation_id, user_id)

### 15. **messages**
Messages in conversations
- **id** (uuid, PK)
- **conversation_id** (uuid, FK to conversations.id, NOT NULL)
- **sender_id** (uuid, FK to profiles.id, NOT NULL)
- **content** (text, NOT NULL)
- **is_encrypted** (boolean, default false)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 16. **notifications**
User notifications
- **id** (uuid, PK)
- **user_id** (uuid, FK to profiles.id, NOT NULL)
- **type** (text, NOT NULL)
- **title** (text, NOT NULL)
- **message** (text, NOT NULL)
- **data** (jsonb, nullable)
- **is_read** (boolean, default false)
- **read_at** (timestamptz, nullable)
- **created_at** (timestamptz)

### 17. **saved_listings**
Sellers' saved listings
- **id** (uuid, PK)
- **seller_id** (uuid, FK to profiles.id, NOT NULL)
- **listing_id** (uuid, FK to listings.id, NOT NULL)
- **saved_at** (timestamptz, default now())
- UNIQUE(seller_id, listing_id)

### 18. **seller_services**
Services offered by sellers
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **service_name** (text, NOT NULL)
- **description** (text, nullable)
- **price_range** (text, nullable)
- **created_at** (timestamptz)

### 19. **seller_technologies**
Technologies used by sellers
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **technology_name** (text, NOT NULL)
- **proficiency_level** (text, nullable)
- **years_experience** (integer, nullable)

### 20. **seller_team_members**
Team members for seller profiles
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **name** (text, NOT NULL)
- **role** (text, NOT NULL)
- **bio** (text, nullable)
- **avatar_url** (text, nullable)

### 21. **seller_certifications**
Certifications held by sellers
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **certification_name** (text, NOT NULL)
- **issuing_organization** (text, NOT NULL)
- **issue_date** (date, NOT NULL)
- **expiry_date** (date, nullable)
- **credential_id** (text, nullable)
- **verification_url** (text, nullable)

### 22. **seller_portfolio**
Portfolio items for sellers
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **title** (text, NOT NULL)
- **description** (text, nullable)
- **project_url** (text, nullable)
- **completed_date** (date, nullable)
- **tags** (text[], nullable)
- **created_at** (timestamptz)

### 23. **portfolio_images**
Images for portfolio items
- **id** (uuid, PK)
- **portfolio_id** (uuid, FK to seller_portfolio.id, NOT NULL)
- **image_url** (text, NOT NULL)
- **caption** (text, nullable)
- **order_index** (integer, default 0)

### 24. **seller_metrics**
Performance metrics for sellers
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL, UNIQUE)
- **total_projects** (integer, default 0)
- **completed_projects** (integer, default 0)
- **average_rating** (numeric, nullable)
- **total_reviews** (integer, default 0)
- **response_time_hours** (numeric, nullable)
- **on_time_delivery_rate** (numeric, nullable)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 25. **seller_working_hours**
Working hours for sellers
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **day_of_week** (integer, NOT NULL) - 0-6
- **start_time** (time, NOT NULL)
- **end_time** (time, NOT NULL)
- **is_available** (boolean, default true)

### 26. **seller_badges**
Achievement badges for sellers
- **id** (uuid, PK)
- **seller_profile_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **badge_type** (text, NOT NULL)
- **badge_name** (text, NOT NULL)
- **earned_at** (timestamptz, default now())

### 27. **payment_milestones**
Payment milestones for contracts
- **id** (uuid, PK)
- **contract_id** (uuid, FK to contracts.id, NOT NULL)
- **deal_room_id** (uuid, FK to deal_rooms.id, nullable)
- **milestone_name** (text, NOT NULL)
- **description** (text, nullable)
- **due_date** (date, nullable)
- **amount** (numeric, NOT NULL)
- **currency** (text, default 'USD')
- **status** (text, default 'pending')
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 28. **contracts**
Contracts between buyers and sellers
- **id** (uuid, PK)
- **deal_room_id** (uuid, FK to deal_rooms.id, NOT NULL)
- **title** (text, NOT NULL)
- **content** (text, nullable)
- **status** (text, default 'draft')
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 29. **proposal_requests**
Requests for proposals from buyers
- **id** (uuid, PK)
- **user_id** (uuid, FK to profiles.id, NOT NULL)
- **seller_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **listing_id** (uuid, FK to listings.id, nullable)
- **message** (text, NOT NULL)
- **status** (text, default 'pending')
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### 30. **proposal_responses**
Responses to proposal requests
- **id** (uuid, PK)
- **proposal_request_id** (uuid, FK to proposal_requests.id, NOT NULL)
- **seller_id** (uuid, FK to seller_profiles.id, NOT NULL)
- **message** (text, NOT NULL)
- **attachments** (jsonb[], nullable)
- **created_at** (timestamptz)

## Key Relationships

1. **User Hierarchy**:
   - `auth.users` → `profiles` (1:1)
   - `profiles` → `buyer_profiles` OR `seller_profiles` (1:1, based on user_type)

2. **Listing Flow**:
   - `buyer_profiles` → `listings` (1:many)
   - `listings` → `listing_requirements` (1:many)
   - `listings` → `project_categories` (many:1)

3. **Proposal Flow**:
   - `seller_profiles` → `proposals` (1:many)
   - `listings` → `proposals` (1:many)
   - `proposals` → `proposal_milestones` (1:many)

4. **Deal Room Flow**:
   - `proposals` → `deal_rooms` (1:1)
   - `deal_rooms` → `deal_room_participants` (1:many)
   - `deal_rooms` → `deal_room_messages` (1:many)
   - `deal_rooms` → `deal_room_files` (1:many)

5. **Communication**:
   - `conversations` → `conversation_participants` (1:many)
   - `conversations` → `messages` (1:many)
   - `profiles` → `messages` (1:many, as sender)

6. **Seller Profile Extensions**:
   - `seller_profiles` → `seller_services` (1:many)
   - `seller_profiles` → `seller_technologies` (1:many)
   - `seller_profiles` → `seller_certifications` (1:many)
   - `seller_profiles` → `seller_portfolio` (1:many)
   - `seller_portfolio` → `portfolio_images` (1:many)

## Common Query Patterns

1. **Listings with Categories and Buyer Info**:
   ```sql
   listings
     → project_categories (via category_id)
     → profiles (via buyer_id)
     → listing_requirements (via listing_id)
   ```

2. **Proposals with Seller Info**:
   ```sql
   proposals
     → seller_profiles (via seller_id)
       → profiles (via user_id)
     → proposal_milestones (via proposal_id)
   ```

3. **Deal Rooms with Participants**:
   ```sql
   deal_rooms
     → deal_room_participants (via deal_room_id)
       → profiles (via user_id)
     → listings (via listing_id)
     → proposals (via proposal_id)
   ```

4. **Conversations with Participants**:
   ```sql
   conversations
     → conversation_participants (via conversation_id)
       → profiles (via user_id)
     → messages (via conversation_id)
   ```

## Nullable Fields Summary

Most fields are nullable except for:
- Primary keys and foreign keys
- Core identifiers (email, user_type, title, description)
- Status fields with defaults
- Timestamps with defaults
- Relationship-defining fields

The schema uses nullable fields extensively to allow progressive data collection and optional features.