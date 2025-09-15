-- Add show_timers column to businesses table
-- This column controls whether customers see actual countdown timers or just "Preparing..." text

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS show_timers boolean DEFAULT true;

-- Update existing businesses to have show_timers enabled by default
UPDATE businesses SET show_timers = true WHERE show_timers IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN businesses.show_timers IS 'Controls whether customers see actual countdown timers (true) or just preparing text (false)';
