import * as z from 'zod'

export const storeSchema = z.object({
    name: z.string({ required_error: 'store name is required '}).min(3, { message: "store name should be at least 3 characters"})
})

export const expenseCategorySchema = z.object({
    name: z.string({ required_error: 'expense category name is required '}).min(3, { message: "expense category name should be at least 3 characters"})
})

export const productCategorySchemaClient = z.object({
    name: z.string({ required_error: 'product category name is required '}).min(3, { message: "product category name should be at least 3 characters"}),
})

export const colorSchema = z.object({
    name: z.string().min(2),
    value: z.string().min(4).max(9).regex(/^#/, {
      message: 'Color value should be hex # '
    }),
})

export const productCategorySchema = z.object({
    name: z.string({ required_error: 'product category name is required '}).min(3, { message: "product category name should be at least 3 characters"}),
    url: z.string({ required_error: 'url is required '}).min(3, { message: "image url should be at least 3 characters"}),
    referenceId: z.string({ required_error: 'reference id is required '}).min(3, { message: "reference id should be at least 3 characters"})
})

export const commissionSchema = z.object({
    name: z.string({ required_error: 'employee name is required '}).min(3, { message: "employee name should be at least 3 characters"}),
    unit: z.string({ required_error: 'unit(s) are required ' }).min(3, { message: "unit(s) is required" }),
    services: z.array(z.object({ label: z.string(), value: z.string() })),
})

export const orderCategorySchema = z.object({
    name: z.string({ required_error: 'order category name is required '}).min(3, { message: "order category name should be at least 3 characters"}),
    appointmentUse: z.boolean().default(false),
    comissionAmount: z.coerce.number(),
    storeAmount: z.coerce.number(),
    nonStoreAmount: z.coerce.number(),
})

export const expenseSchema = z.object({
    title: z.string({ required_error: 'title is required '}).min(3, { message: "title should be at least 3 characters"}),
    reference: z.string({ required_error: 'reference no is required '}).min(3, { message: "reference no should be at least 3 characters"}),
    category: z.object({ label: z.string(), value: z.string() }),
    amount:  z.coerce.number().min(1, "amount should be atleast 1 character"),
})

export const appointmentSchema = z.object({
    name: z.string({ required_error: 'client name is required '}).min(3, { message: "title should be at least 3 characters"}),
    phone: z.string({ required_error: 'phone no is required '}).min(12, { message: "phone number should be 12 characters"}),
    unit: z.string({ required_error: 'unit(s) are required '}).min(3, { message: "unit should be at least 3 characters long"}),
    type:  z.string({ required_error: 'unit type required '}).min(3, { message: "unit type is required"}),
    services: z.array(z.object({ label: z.string(), value: z.string() })),
    time: z.string({ required_error: "choose appointment time"}).min(3, { message: "appointment time is required"}),
    date: z.union([z.date(), z.string()]),
    note: z.string().nullable()
})

export const sheetSchema = z.object({
    sheetId: z.string({ required_error: "sheet id is required"}).min(43, { message: "sheet id should be 43 characters long"}),
    sheetClient: z.string({ required_error: "sheet client email is required"}).min(10, { message: "sheet client email is required"}),
    sheetSecret:  z.string({ required_error: "sheet secret is required"}).min(10, { message: "sheet secret is required"}),
})

export const orderSchema = z.object({
    name: z.string({ required_error: 'client name is required ' }).min(4, { message: "client name is required(4)" }),
    unit: z.string({ required_error: 'unit(s) are required ' }).min(3, { message: "unit(s) is required" }),
    amountPaid:  z.coerce.number(),
    balance:  z.coerce.number(),
    quantity:  z.coerce.number(),
    categories: z.array(z.object({ label: z.string(), value: z.string() })),
    phone: z.string({ required_error: 'phone no is required ' }).min(12, { message: "phone number should be 12 characters" }),
    headSize: z.string().min(3, { message: "head-size is required" }),
    paymentMethod: z.string({ required_error: 'payment method is required ' }).min(3, { message: "payment method is required" }),
    note: z.string().nullable(),
});

