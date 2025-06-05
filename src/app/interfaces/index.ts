declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        // other fields if needed
      };
    }
  }
}

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
};
