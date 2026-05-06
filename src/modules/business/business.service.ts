import prisma from '../../config/database';

export const createBusiness = async (data: {
    name: string;
    type: string;
    phone: string;
    city: string;
    province?: string;
    description?: string;
    currency: string;
}) => {
    return prisma.business.create({ data });
};

export const getBusinessById = async (id: string) => {
    return prisma.business.findUnique({ where: { id } });
};

export const searchBusinesses = async (filters: {
    type?: string;
    city?: string;
    province?: string;
}) => {
    return prisma.business.findMany({
        where: {
            ...(filters.type     && { type: filters.type }),
            ...(filters.city     && { city: { contains: filters.city, mode: 'insensitive' } }),
            ...(filters.province && { province: { contains: filters.province, mode: 'insensitive' } }),
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });
};