-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clerk_users table for users authenticated via Clerk
CREATE TABLE public.clerk_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email VARCHAR,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    plan TEXT,
    api_limit INT4 DEFAULT 100,
    has_access BOOLEAN DEFAULT true,
    customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table (matches web version) - supports both Supabase and Clerk users
CREATE TABLE public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    clerk_user_id UUID REFERENCES public.clerk_users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    image_url TEXT,
    domain TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Article metadata
    author TEXT,
    published_date TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER,
    
    -- User interaction
    favorite BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    
    -- Collections
    collection_id UUID,
    
    -- Additional fields for content storage
    note TEXT, -- Store full article content
    html_content TEXT, -- Store HTML formatted content
    tags TEXT[] DEFAULT '{}',
    
    -- Ensure exactly one user reference is provided
    CONSTRAINT check_user_reference CHECK (
        (user_id IS NOT NULL AND clerk_user_id IS NULL) OR 
        (user_id IS NULL AND clerk_user_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_clerk_user_id ON public.links(clerk_user_id);
CREATE INDEX idx_links_created_at ON public.links(created_at DESC);
CREATE INDEX idx_links_url ON public.links(url);
CREATE INDEX idx_clerk_users_clerk_id ON public.clerk_users(clerk_id);
CREATE INDEX idx_clerk_users_email ON public.clerk_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clerk_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Clerk Users policies (Note: Clerk users don't use Supabase auth, so these are more permissive)
CREATE POLICY "Clerk users can manage own data" ON public.clerk_users
    FOR ALL USING (true); -- Will be managed by application logic

-- Links policies (updated to support both user types)
CREATE POLICY "Users can view own links" ON public.links
    FOR SELECT USING (
        (auth.uid() = user_id) OR 
        (clerk_user_id IS NOT NULL)
    );

CREATE POLICY "Users can insert own links" ON public.links
    FOR INSERT WITH CHECK (
        (auth.uid() = user_id) OR 
        (clerk_user_id IS NOT NULL)
    );

CREATE POLICY "Users can update own links" ON public.links
    FOR UPDATE USING (
        (auth.uid() = user_id) OR 
        (clerk_user_id IS NOT NULL)
    );

CREATE POLICY "Users can delete own links" ON public.links
    FOR DELETE USING (
        (auth.uid() = user_id) OR 
        (clerk_user_id IS NOT NULL)
    );

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clerk_users_updated_at BEFORE UPDATE ON public.clerk_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON public.links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 