import { supabase } from '@/lib/supabase';

// Helper function to parse sort parameter (e.g., '-created_date' or 'date')
const parseSort = (sort) => {
  if (!sort) return { column: 'created_date', ascending: false };
  const ascending = !sort.startsWith('-');
  const column = ascending ? sort : sort.substring(1);
  return { column, ascending };
};

// Helper function to build query with filters
const buildQuery = (query, filters = {}) => {
  let q = query;
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        q = q.in(key, value);
      } else {
        q = q.eq(key, value);
      }
    }
  });
  
  return q;
};

export const apiClient = {
  entities: {
    Product: {
      filter: async (filters = {}, sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('products')
          .select('*')
          .order(column, { ascending });
        
        query = buildQuery(query, filters);
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      list: async (sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('products')
          .select('*')
          .order(column, { ascending });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      get: async (id) => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      },
      
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('products')
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      update: async (id, data) => {
        const { data: result, error } = await supabase
          .from('products')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { success: true };
      }
    },
    
    Event: {
      filter: async (filters = {}, sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('events')
          .select('*')
          .order(column, { ascending });
        
        query = buildQuery(query, filters);
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      list: async (sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('events')
          .select('*')
          .order(column, { ascending });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      get: async (id) => {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      },
      
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('events')
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      update: async (id, data) => {
        const { data: result, error } = await supabase
          .from('events')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { success: true };
      }
    },
    
    Booking: {
      filter: async (filters = {}, sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('bookings')
          .select('*')
          .order(column, { ascending });
        
        query = buildQuery(query, filters);
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      list: async (sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('bookings')
          .select('*')
          .order(column, { ascending });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      get: async (id) => {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      },
      
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('bookings')
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      update: async (id, data) => {
        const { data: result, error } = await supabase
          .from('bookings')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { success: true };
      }
    },
    
    Order: {
      filter: async (filters = {}, sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('orders')
          .select('*')
          .order(column, { ascending });
        
        query = buildQuery(query, filters);
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      list: async (sort, limit) => {
        const { column, ascending } = parseSort(sort);
        let query = supabase
          .from('orders')
          .select('*')
          .order(column, { ascending });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      
      get: async (id) => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      },
      
      create: async (data) => {
        const { data: result, error } = await supabase
          .from('orders')
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      update: async (id, data) => {
        const { data: result, error } = await supabase
          .from('orders')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { success: true };
      }
    }
  },
  
  integrations: {
    Core: {
      SendEmail: async (data) => {
        try {
          console.log('SendEmail called with:', { 
            to: data.to, 
            subject: data.subject,
            hasBody: !!data.body 
          });

          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // Use Resend's default domain for now (onboarding@resend.dev)
              // Once you verify portell.wine domain in Resend, change this to:
              // from: data.from_name ? `${data.from_name} <noreply@portell.wine>` : 'Portell Winery <noreply@portell.wine>',
              from: data.from_name ? `${data.from_name} <onboarding@resend.dev>` : 'Portell Winery <onboarding@resend.dev>',
              to: data.to,
              subject: data.subject,
              html: data.body,
            }),
          });

          const responseData = await response.json();

          if (!response.ok) {
            console.error('Email API error response:', responseData);
            throw new Error(responseData.error || 'Failed to send email');
          }

          console.log('Email sent successfully:', responseData);
          return { success: true, id: responseData.id };
        } catch (error) {
          console.error('Email sending error:', error);
          throw error;
        }
      },
      InvokeLLM: async (data) => {
        // Note: Implement using Supabase Edge Functions or external API
        console.warn('InvokeLLM not implemented - use Edge Functions or external API');
        return { response: '' };
      },
      UploadFile: async (data) => {
        // Use Supabase Storage
        const { data: result, error } = await supabase.storage
          .from('uploads')
          .upload(data.path, data.file);
        
        if (error) throw error;
        return { url: result.path };
      },
      GenerateImage: async (data) => {
        console.warn('GenerateImage not implemented');
        return { url: '' };
      },
      ExtractDataFromUploadedFile: async (data) => {
        console.warn('ExtractDataFromUploadedFile not implemented');
        return {};
      },
      CreateFileSignedUrl: async (data) => {
        const { data: result, error } = await supabase.storage
          .from(data.bucket || 'public')
          .createSignedUrl(data.path, data.expiresIn || 3600);
        
        if (error) throw error;
        return { url: result.signedUrl };
      },
      UploadPrivateFile: async (data) => {
        const { data: result, error } = await supabase.storage
          .from(data.bucket || 'private')
          .upload(data.path, data.file);
        
        if (error) throw error;
        return { url: result.path };
      }
    }
  },
  
  auth: {
    me: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return null;
      return user;
    },
    login: async (credentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      if (error) throw error;
      return data;
    },
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    }
  }
};
