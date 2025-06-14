-- Check if auth schema exists and what tables it contains
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'auth';

-- List tables in auth schema if it exists
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_schema, table_name;
