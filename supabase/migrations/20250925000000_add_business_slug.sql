-- Add slug field to businesses table for custom routing
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add show_timers column only if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='show_timers') THEN
        ALTER TABLE businesses ADD COLUMN show_timers BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS businesses_slug_idx ON businesses(slug);

-- Add constraint to ensure slug is URL-friendly (only if it doesn't exist)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name='businesses_slug_format') THEN
        ALTER TABLE businesses 
        ADD CONSTRAINT businesses_slug_format 
        CHECK (slug ~ '^[a-z0-9-]+$' AND length(slug) >= 3 AND length(slug) <= 50);
    END IF;
END $$;

-- Update existing demo business with a slug
UPDATE businesses 
SET slug = 'demo-cafe' 
WHERE id = '10000000-0000-0000-0000-000000000001';
