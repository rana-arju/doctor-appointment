export type IAdminFilterRequest = {
    name?: string;
    contactNumber?: string;
    email?: string;
    role?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchTerm?: string;

}