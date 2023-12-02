
# Version 15 Updates

## Products
- [x] Product category CRUD fix.
- [x] Fix sort
- [] Check for any pending errors
- [] Active tab to be pushed to the url - global
- [] Introduce support for product colors, allowing multi-color selection.

- [] Introduce support for product colors, allowing multi-color selection.
- [] Implement support for product sizes with multi-size selection (not saved in the database).
- [] Create CRUD operations for products.

## Commission
- [x] Add commissions to google sheet
- [x] Calculate weekly total and auto add to expenses(-if clients agree) 
- [x] Add weeks and month sort (preview the total of previous weeks & months)


## Gallery
- [] Implement a gallery linked to products, potentially showcasing client appreciation posts with details like name and Instagram handle etc.

# Pending 15.5 Updates

## Notifications
- [ ] Implement notifications page updates with options to mark notifications as read and delete them, either manually or automatically after a specified time (e.g., 7 days or based on client demand).
- [ ] Display signed-in devices information.
- [ ] Add a date field to the orders and expenses section to allow sorting by date.

- [ ] Implement the ability to sort orders and expenses by category (e.g., food, shoes, etc.).

## Sms Actions
- [ ] Implement sms notifications(HPKS) (a little bit of research required)
- [ ] Securely store details in the database(userId, name, etc)

## Daily database back up
- [ ] Using next/node-cron to sync data from the database to the main google sheet database managed by the main admin(not store admin)

# Version 16 Updates

## API (Docs)
- [ ] Introduce API keys management, including functionalities for generating, encrypting, and deleting keys.
- [ ] Create API endpoints for managing appointments with CRUD operations.
- [ ] Create API endpoints for managing products with GET operation.

## Work On Monthly Subscriptions
- [ ] Make it a complete sass with more login options(google etc)
- [ ] Include monthly subscriptions i.e clients will be able to pay directly (6k monthly for starters)
- [ ] Integrate Intasend For Online Payments (m-pesa/card)
