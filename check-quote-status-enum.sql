-- Check what values the quote_request status enum allows
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value,
    e.enumsortorder AS sort_order
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname LIKE '%quote%' OR t.typname LIKE '%request%' OR t.typname LIKE '%status%'
ORDER BY t.typname, e.enumsortorder;

-- Also check the column constraint directly
SELECT 
    column_name,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quote_requests'
ORDER BY ordinal_position;