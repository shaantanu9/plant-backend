# Database Schema Documentation

This document outlines the expected structure of the MongoDB collections used by the application.

## Containers Collection (`containers`)

*   `_id`: ObjectId (Primary Key)
*   `containerCode`: String (Unique identifier, e.g., "C001")
*   `type`: String (e.g., "Standard", "Large", "Special")
*   `status`: String (Enum: `in_inventory`, `transit_out`, `with_subscriber`, `transit_in`, `returned`, `under_maintenance`, `cleaned`, `lost`)
*   `condition`: String (Enum: "Good", "Fair", "Poor", "Needs Maintenance")
*   `subscriberId`: ObjectId (Ref: `subscribers`, nullable)
*   `lastDeliveryId`: ObjectId (Ref: `deliveries`, nullable)
*   `depositStatus`: String (Enum: `pending`, `collected`, `refunded`, `forfeited`)
*   `lastMaintenanceDate`: Date (Nullable)
*   `purchaseDate`: Date
*   `createdAt`: Date
*   `updatedAt`: Date
*   `history`: Array of Objects
    *   `timestamp`: Date
    *   `status`: String (Previous status)
    *   `userId`: ObjectId (User who initiated the change)
    *   `notes`: String (Optional)

**Indexes:**
*   `containerCode` (unique)
*   `status`
*   `type`

## Deliveries Collection (`deliveries`)

*   `_id`: ObjectId (Primary Key)
*   `deliveryCode`: String (Unique identifier, e.g., "D001")
*   `subscriberId`: ObjectId (Ref: `subscribers`)
*   `personnelId`: ObjectId (Ref: `users`, Role: Delivery Personnel, nullable)
*   `status`: String (Enum: `pending`, `assigned`, `in_transit`, `delivered`, `partially_delivered`, `failed`, `cancelled`)
*   `deliveryAddress`: Object (Street, City, Zip, Coordinates)
*   `scheduledDate`: Date
*   `estimatedDeliveryTime`: String (e.g., "2-4 PM")
*   `actualDeliveryTime`: Date (Nullable)
*   `containersDelivered`: Array of Objects
    *   `containerId`: ObjectId (Ref: `containers`)
    *   `verified`: Boolean (Default: false)
    *   `verificationTime`: Date (Nullable)
*   `containersReturned`: Array of Objects (Similar structure)
*   `notes`: String (Optional)
*   `createdAt`: Date
*   `updatedAt`: Date

**Indexes:**
*   `deliveryCode` (unique)
*   `status`
*   `personnelId`
*   `subscriberId`
*   `scheduledDate`

## Users Collection (`users`)

*   `_id`: ObjectId
*   `name`: String
*   `email`: String (Unique)
*   `password`: String (Hashed)
*   `role`: String (Enum: `admin`, `delivery_personnel`, `subscriber`)
*   `isActive`: Boolean (Default: true)
*   `createdAt`: Date
*   `updatedAt`: Date

**Indexes:**
*   `email` (unique)
*   `role`

## Subscriptions Collection (`subscriptions`)

*   `_id`: ObjectId
*   `subscriberId`: ObjectId (Ref: `users`)
*   `planType`: String (e.g., "Basic", "Premium")
*   `status`: String (Enum: `active`, `paused`, `cancelled`)
*   `startDate`: Date
*   `endDate`: Date (Nullable, for fixed-term)
*   `nextBillingDate`: Date
*   `containerLimit`: Number
*   `createdAt`: Date
*   `updatedAt`: Date

**Indexes:**
*   `subscriberId`
*   `status`

*Note: This is an inferred schema based on API endpoints and common practices. Actual implementation might differ.* 