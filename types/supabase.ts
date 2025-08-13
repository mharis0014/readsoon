export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            clerk_users: {
                Row: {
                    id: string
                    clerk_id: string
                    email: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    website: string | null
                    plan: string | null
                    api_limit: number | null
                    has_access: boolean | null
                    customer_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    clerk_id: string
                    email?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    plan?: string | null
                    api_limit?: number | null
                    has_access?: boolean | null
                    customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    clerk_id?: string
                    email?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    plan?: string | null
                    api_limit?: number | null
                    has_access?: boolean | null
                    customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    website: string | null
                    plan: string | null
                    api_limit: number | null
                    email: string | null
                    has_access: boolean | null
                    customer_id: string | null
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    plan?: string | null
                    api_limit?: number | null
                    email?: string | null
                    has_access?: boolean | null
                    customer_id?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    plan?: string | null
                    api_limit?: number | null
                    email?: string | null
                    has_access?: boolean | null
                    customer_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            links: {
                Row: {
                    id: string
                    user_id: string | null
                    clerk_user_id: string | null
                    url: string
                    title: string | null
                    description: string | null
                    image_url: string | null
                    domain: string | null
                    created_at: string
                    updated_at: string
                    author: string | null
                    published_date: string | null
                    reading_time: number | null
                    favorite: boolean | null
                    status: string | null
                    collection_id: string | null
                    note: string | null
                    html_content: string | null
                    tags: string[] | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    clerk_user_id?: string | null
                    url: string
                    title?: string | null
                    description?: string | null
                    image_url?: string | null
                    domain?: string | null
                    created_at?: string
                    updated_at?: string
                    author?: string | null
                    published_date?: string | null
                    reading_time?: number | null
                    favorite?: boolean | null
                    status?: string | null
                    collection_id?: string | null
                    note?: string | null
                    html_content?: string | null
                    tags?: string[] | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    clerk_user_id?: string | null
                    url?: string
                    title?: string | null
                    description?: string | null
                    image_url?: string | null
                    domain?: string | null
                    created_at?: string
                    updated_at?: string
                    author?: string | null
                    published_date?: string | null
                    reading_time?: number | null
                    favorite?: boolean | null
                    status?: string | null
                    collection_id?: string | null
                    note?: string | null
                    html_content?: string | null
                    tags?: string[] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "links_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "links_clerk_user_id_fkey"
                        columns: ["clerk_user_id"]
                        isOneToOne: false
                        referencedRelation: "clerk_users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
} 