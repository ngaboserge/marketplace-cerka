-- Check the actual structure of supplier_listings table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'supplier_listings' 
ORDER BY ordinal_position;

-- Check if there are any enum types
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname LIKE '%status%'
ORDER BY t.typname, e.enumsortorder;