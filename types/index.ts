export interface Greeting {
  id: string;
  name: string;
  message: string;
  image: string | null;
  timestamp: Date;
}

// Interface untuk data dari Supabase
export interface GreetingDB {
  id: string;
  name: string;
  message: string;
  image_url: string | null;
  created_at: string; // ISO string timestamp
}