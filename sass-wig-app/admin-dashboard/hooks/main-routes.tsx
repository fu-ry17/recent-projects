
const mainRoutes = ({ pathname, params }: { pathname: string, params: any }) => {
    
    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Dashboard',
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orders',
            active: pathname === `/${params.storeId}/orders`
        },
        {
            href: `/${params.storeId}/expenses`,
            label: 'Expenses',
            active: pathname === `/${params.storeId}/expenses`
        },
        {
            href: `/${params.storeId}/appointments`,
            label: 'Appointments',
            active: pathname === `/${params.storeId}/appointments`
        },
        {
            href: `/${params.storeId}/commissions`,
            label: 'Commissions',
            active: pathname === `/${params.storeId}/commissions`
        },
        // {
        //     href: `/${params.storeId}/inventory`,
        //     label: 'Inventory',
        //     active: pathname === `/${params.storeId}/inventory`
        // },
        {
            href: `/${params.storeId}/products`,
            label: 'Products',
            active: pathname === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`
        },
        {
            href: `/${params.storeId}/api-docs`,
            label: 'Api(docs)',
            active: pathname === `/${params.storeId}/api-docs`
        }
    ]
  
  return routes
}

export default mainRoutes