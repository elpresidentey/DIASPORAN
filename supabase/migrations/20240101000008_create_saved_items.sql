-- Create saved_items table
-- Stores user's saved/favorited listings

CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('dining', 'accommodation', 'flight', 'event', 'transport')),
  item_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_saved_item UNIQUE (user_id, item_type, item_id)
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX idx_saved_items_item_type ON public.saved_items(item_type);
CREATE INDEX idx_saved_items_item_id ON public.saved_items(item_id);
CREATE INDEX idx_saved_items_created_at ON public.saved_items(created_at);

-- Composite index for user's saved items by type
CREATE INDEX idx_saved_items_user_type ON public.saved_items(user_id, item_type);

-- Enable Row Level Security
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_items TO authenticated;
