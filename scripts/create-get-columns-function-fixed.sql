-- Function to get all columns for a table
CREATE OR REPLACE FUNCTION get_table_columns(table_name TEXT)
RETURNS TABLE (column_name TEXT, data_type TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT, 
    c.data_type::TEXT
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' 
    AND c.table_name = $1
  ORDER BY 
    c.ordinal_position;
END;
$$ LANGUAGE plpgsql;

-- Test the function
SELECT * FROM get_table_columns('deal_rooms');
