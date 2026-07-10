-- Create custom enums
CREATE TYPE contact_status AS ENUM ('subscribed', 'unsubscribed', 'bounced', 'complained');
CREATE TYPE list_type AS ENUM ('static', 'dynamic');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed');
CREATE TYPE event_type AS ENUM ('open', 'click');

-- Contacts Table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    status contact_status NOT NULL DEFAULT 'subscribed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, email)
);

-- Lists Table
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type list_type NOT NULL DEFAULT 'static',
    rule_definition JSONB, -- For dynamic lists
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- List Memberships
CREATE TABLE list_memberships (
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    join_method TEXT NOT NULL DEFAULT 'manual', -- manual, csv, auto, signup
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (contact_id, list_id)
);

-- Templates Table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content_blocks JSONB,
    html_cache TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaigns Table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT,
    sender_name TEXT,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
    status campaign_status NOT NULL DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaign Target Lists (including exclusions)
CREATE TABLE campaign_target_lists (
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    is_exclusion BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (campaign_id, list_id)
);

-- Events Table (Opens, Clicks)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    target_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_target_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only see and manage their own data
CREATE POLICY "Users can manage their own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own lists" ON lists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own templates" ON templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- For junction tables, ensure access through the parent relationships
CREATE POLICY "Users can manage memberships for their lists" ON list_memberships FOR ALL 
USING (EXISTS (SELECT 1 FROM lists WHERE lists.id = list_memberships.list_id AND lists.user_id = auth.uid()));

CREATE POLICY "Users can manage targets for their campaigns" ON campaign_target_lists FOR ALL 
USING (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_target_lists.campaign_id AND campaigns.user_id = auth.uid()));

CREATE POLICY "Users can see events for their contacts" ON events FOR ALL 
USING (EXISTS (SELECT 1 FROM contacts WHERE contacts.id = events.contact_id AND contacts.user_id = auth.uid()));
