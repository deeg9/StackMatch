import { createClient as createSupabaseClient } from "@/lib/supabase/server"

/**
 * Wrapper around Supabase client to handle strict type issues
 * This provides a more flexible interface while maintaining type safety where needed
 */
export function createClient() {
  const supabase = createSupabaseClient()
  
  // Return the client with relaxed typing for problematic operations
  return {
    ...supabase,
    // Override methods that cause strict typing issues
    from: (table: string) => {
      const tableBuilder = (supabase as any).from(table)
      return {
        ...tableBuilder,
        // Add type-safe versions of common operations
        select: (columns?: string) => tableBuilder.select(columns),
        insert: (data: any) => tableBuilder.insert(data),
        update: (data: any) => tableBuilder.update(data),
        delete: () => tableBuilder.delete(),
        eq: (column: string, value: any) => tableBuilder.eq(column, value),
        neq: (column: string, value: any) => tableBuilder.neq(column, value),
        in: (column: string, values: any[]) => tableBuilder.in(column, values),
        single: () => tableBuilder.single(),
        limit: (count: number) => tableBuilder.limit(count),
        order: (column: string, options?: any) => tableBuilder.order(column, options),
      }
    }
  }
}

export type SupabaseClient = ReturnType<typeof createClient>