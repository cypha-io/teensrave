-- Manual migration to convert agreements_accepted from boolean to jsonb
-- This cannot be done automatically, so we need to handle it manually

-- Step 1: Add a temporary column
ALTER TABLE "media_accreditation" ADD COLUMN "agreements_accepted_temp" jsonb;

-- Step 2: Convert existing boolean values to jsonb array
-- If true, set to array with all 5 agreements, if false, set to empty array
UPDATE "media_accreditation" 
SET "agreements_accepted_temp" = 
  CASE 
    WHEN "agreements_accepted" = true THEN 
      '["non-transferrable", "follow-guidelines", "credit-teensrave", "revoke-access", "data-consent"]'::jsonb
    ELSE 
      '[]'::jsonb
  END;

-- Step 3: Drop the old boolean column
ALTER TABLE "media_accreditation" DROP COLUMN "agreements_accepted";

-- Step 4: Rename the temp column to the original name
ALTER TABLE "media_accreditation" RENAME COLUMN "agreements_accepted_temp" TO "agreements_accepted";

-- Step 5: Set NOT NULL constraint
ALTER TABLE "media_accreditation" ALTER COLUMN "agreements_accepted" SET NOT NULL;
