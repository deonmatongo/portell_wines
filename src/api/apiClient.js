// Generic API client
// Replace this with your actual API implementation

export const apiClient = {
  entities: {
    Product: {
      filter: async (filters, sort, limit) => [],
      list: async (sort, limit) => [],
      get: async (id) => null,
      create: async (data) => ({ id: Date.now(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ success: true })
    },
    Event: {
      filter: async (filters, sort, limit) => [],
      list: async (sort, limit) => [],
      get: async (id) => null,
      create: async (data) => ({ id: Date.now(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ success: true })
    },
    Booking: {
      filter: async (filters, sort, limit) => [],
      list: async (sort, limit) => [],
      get: async (id) => null,
      create: async (data) => ({ id: Date.now(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ success: true })
    },
    Order: {
      filter: async (filters, sort, limit) => [],
      list: async (sort, limit) => [],
      get: async (id) => null,
      create: async (data) => ({ id: Date.now(), ...data }),
      update: async (id, data) => ({ id, ...data }),
      delete: async (id) => ({ success: true })
    }
  },
  integrations: {
    Core: {
      SendEmail: async (data) => ({ success: true }),
      InvokeLLM: async (data) => ({ response: '' }),
      UploadFile: async (data) => ({ url: '' }),
      GenerateImage: async (data) => ({ url: '' }),
      ExtractDataFromUploadedFile: async (data) => ({}),
      CreateFileSignedUrl: async (data) => ({ url: '' }),
      UploadPrivateFile: async (data) => ({ url: '' })
    }
  },
  auth: {
    me: async () => null,
    login: async (credentials) => ({ user: null }),
    logout: async () => ({ success: true })
  }
};

