"use server"
import prismadb from "./prisma";

export const convertToNumber = (a: string) => {
    return parseInt(a.replace(',', ''));
}

export const createUniqueCategories = async (response: Record<string, string>[], storeId: string, expense?: boolean) => {
    try {
        // Get unique orderCategories
        const uniqueCategories = new Set<string>();
        response.forEach((o: any) => {
            if (o.category) {
                uniqueCategories.add(o.category.toLowerCase());
            }
        });

        // Convert the Set to an array
        const uniqueCategoriesArray = [...uniqueCategories];

        // Create order categories
        if (uniqueCategoriesArray.length > 0) {
            const categoryData = uniqueCategoriesArray.map((i) => ({
                name: expense ? i?.toLowerCase() : i?.toLowerCase()?.replace(/ /g, '-'),
                storeId,
            }));

            // Filter out objects with empty names
            const filteredCategoryData = categoryData.filter((data) => !!data.name);

            if (filteredCategoryData.length > 0) {
                if (expense) {
                    await prismadb.expenseCategory.createMany({
                        data: filteredCategoryData,
                    });
                } else {
                    await prismadb.orderCategory.createMany({
                        data: filteredCategoryData,
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error creating unique categories:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

