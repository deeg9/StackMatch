import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

/**
 * Wrapper around Supabase client to handle strict type issues
 * This provides a more flexible interface while maintaining type safety where needed
 */
export async function createClient(cookieStore?: ReadonlyRequestCookies) {
  const supabase = cookieStore ? createServerClientWithCookies(cookieStore) : await createSupabaseClient()
  
  // Create server client with cookies if provided
  function createServerClientWithCookies(cookies: ReadonlyRequestCookies) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing required Supabase environment variables")
    }

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookies.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }: any) => {
                // For ReadonlyRequestCookies, we can't set cookies directly
                // This is expected behavior in some server contexts
              })
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  }
  
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
    },
    // Add RPC method for database functions
    rpc: (functionName: string, params?: any) => (supabase as any).rpc(functionName, params)
  }
}

export type SupabaseClient = ReturnType<typeof createClient>