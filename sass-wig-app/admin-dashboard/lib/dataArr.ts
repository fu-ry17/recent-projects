
export const monthNames = ["january", "february", "march", "april", "may", "june",
"july", "august", "september", "october", "november", "december"];

export const getMonth = (value?: number) => {
    const currentMonthInt = value ?  value as number : new Date().getMonth() 
    let month: string = ''
    monthNames.map((name, index) => {        
        if(index === currentMonthInt){
            month = name
        }
    })
    return month
}

export const serviceArr = [
    { name: 'laundry'},
    { name: 'installation'}
]

export const type = [
    { id: "non-store", name: 'Non-Store'},
    { id: "store", name: 'Store'}
]

export const paymentMethodArr = [
    { name: "cash"},
    { name: "card" },
    { name: "m-pesa"},
    { name: "m-pesa/card"},
    { name: "m-pesa/cash"},
    { name: "cash/card"}
]

export const headSizeArr = [
    { name: "extra-small"},
    { name: "small"},
    { name: "medium"},
    { name: "large"},
    { name: "extra-large" },
]

// features arrays
export const sortArr = [
    { id: "desc", name: "latest"},
    { id: "asc", name: "oldest" }
]

export const orderStatusArr = [ // both for order ad appointments
    { name: "pending"},
    { name: "delivered"},
    { name: "cancelled"},
    { name: "refund" } // -> incase an order is refunded
]


export const sizeArr = [ 
    { name: "extra-small", value: "XS"},
    { name: "small", value: "S"},
    { name: "medium", value: "M"},
    { name: "large", value: "L"},
    { name: "xlarge", value: "XL"}, 
]
