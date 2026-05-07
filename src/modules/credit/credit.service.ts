import prisma from '../../config/database';

export const addCustomer = async (businessId: string, data: {
    name: string;
    phone?: string;
}) => {
    return prisma.creditCustomer.create({
        data: { ...data, businessId }
    });
};

export const getCustomers = async (businessId: string) => {
    return prisma.creditCustomer.findMany({
        where: { businessId },
        include: {
            entries: {
                where: { paid: false }
            }
        },
        orderBy: { name: 'asc' }
    });
};

export const addCreditEntry = async (customerId: string, data: {
    description: string;
    amount: number;
    currency: string;
    dueDate?: string;
}) => {
    return prisma.creditEntry.create({
        data: {
            customerId,
            description: data.description,
            amount: data.amount,
            currency: data.currency,
            dueDate: data.dueDate ? new Date(data.dueDate) : null
        }
    });
};

export const getCustomerBalance = async (customerId: string) => {
    const customer = await prisma.creditCustomer.findUnique({
        where: { id: customerId },
        include: { entries: true }
    });

    if (!customer) throw new Error('CUSTOMER_NOT_FOUND');

    const totalOwed = customer.entries
        .filter(e => !e.paid)
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const totalPaid = customer.entries
        .filter(e => e.paid)
        .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
        customer,
        totalOwed: totalOwed.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        entries: customer.entries
    };
};

export const markAsPaid = async (entryId: string) => {
    return prisma.creditEntry.update({
        where: { id: entryId },
        data: { paid: true, paidAt: new Date() }
    });
};

export const getOverdue = async (businessId: string) => {
    const now = new Date();
    const customers = await prisma.creditCustomer.findMany({
        where: { businessId },
        include: {
            entries: {
                where: {
                    paid: false,
                    dueDate: { lt: now }
                }
            }
        }
    });

    return customers
        .filter(c => c.entries.length > 0)
        .map(c => ({
            customer: c.name,
            phone: c.phone,
            overdueEntries: c.entries.length,
            totalOverdue: c.entries
                .reduce((sum, e) => sum + Number(e.amount), 0)
                .toFixed(2)
        }));
};