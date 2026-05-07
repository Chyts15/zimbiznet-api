import prisma from '../../config/database';

export const addStockItem = async (businessId: string, data: {
    name: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    currency: string;
    reorderLevel: number;
}) => {
    return prisma.stockItem.create({
        data: { ...data, businessId }
    });
};

export const getStockItems = async (businessId: string) => {
    return prisma.stockItem.findMany({
        where: { businessId },
        orderBy: { name: 'asc' }
    });
};

export const getLowStockItems = async (businessId: string) => {
    const items = await prisma.stockItem.findMany({
        where: { businessId }
    });
    return items.filter(item => item.quantity <= item.reorderLevel);
};

export const recordSale = async (
    businessId: string,
    itemId: string,
    data: { quantity: number; paymentMode: string }
) => {
    const item = await prisma.stockItem.findFirst({
        where: { id: itemId, businessId }
    });

    if (!item) throw new Error('ITEM_NOT_FOUND');
    if (item.quantity < data.quantity) throw new Error('INSUFFICIENT_STOCK');

    const totalAmount = Number(item.sellPrice) * data.quantity;

    const [updatedItem, sale] = await prisma.$transaction([
        prisma.stockItem.update({
            where: { id: itemId },
            data: { quantity: item.quantity - data.quantity }
        }),
        prisma.sale.create({
            data: {
                businessId,
                itemId,
                quantity: data.quantity,
                totalAmount,
                currency: item.currency,
                paymentMode: data.paymentMode
            }
        })
    ]);

    return { updatedItem, sale };
};

export const getSalesSummary = async (businessId: string, period: string) => {
    let startDate = new Date();

    if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const sales = await prisma.sale.findMany({
        where: {
            businessId,
            createdAt: { gte: startDate }
        },
        include: { item: true }
    });

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const totalCost = sales.reduce(
        (sum, s) => sum + Number(s.item.buyPrice) * s.quantity, 0
    );

    return {
        period,
        totalSales: sales.length,
        totalRevenue: totalRevenue.toFixed(2),
        totalCost: totalCost.toFixed(2),
        profit: (totalRevenue - totalCost).toFixed(2),
        sales
    };
};