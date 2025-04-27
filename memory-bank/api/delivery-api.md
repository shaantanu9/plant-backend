# Delivery API Documentation

This document provides detailed information about the `/api/deliveries` endpoints.

## Endpoints

*   **GET /deliveries/listing**: Retrieve delivery listings.
    *   Query Parameters: (e.g., `status`, `personnelId`, `dateRange`, `limit`, `page`)
    *   Response: Array of delivery objects.
*   **POST /deliveries**: Create a new delivery.
    *   Request Body: Details of the delivery (subscriber, address, requested items/containers).
    *   Response: Newly created delivery object.
*   **GET /deliveries/{deliveryId}**: Retrieve a specific delivery.
*   **PUT /deliveries/{deliveryId}/status**: Update the overall delivery status.
*   **PUT /deliveries/{deliveryId}/in-transit**: Mark delivery as in transit.
*   **PUT /deliveries/{deliveryId}/delivered**: Mark delivery as fully delivered.
*   **PUT /deliveries/{deliveryId}/partial**: Mark delivery as partially delivered.
*   **PUT /deliveries/{deliveryId}/cancel**: Cancel the delivery.
*   **POST /deliveries/{deliveryId}/container/delivered**: Add a delivered container record to the delivery.
*   **PUT /deliveries/{deliveryId}/container/{containerId}/verify**: Verify a container associated with the delivery (e.g., scan confirmation).
*   **GET /deliveries/personnel/{personnelId}/optimize-route**: Optimize delivery route for a specific personnel.
    *   Response: Optimized route sequence.

## Delivery Status Lifecycle

*   `pending` -> `assigned` -> `in_transit` -> (`delivered` | `partially_delivered` | `failed`)
*   Can be `cancelled` from `pending` or `assigned`.

## Request/Response Examples

```json
// Example POST /deliveries request body
{
  "subscriberId": "sub123",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zip": "12345"
  },
  "requestedContainers": [
    {"type": "Standard", "quantity": 2},
    {"type": "Large", "quantity": 1}
  ],
  "deliveryDate": "2024-08-15"
}

// Example GET /deliveries/personnel/{personnelId}/optimize-route response
{
  "optimizedRoute": [
    "deliveryId1",
    "deliveryId3",
    "deliveryId2"
  ]
}
```

## Validation Rules

*   `deliveryId`, `personnelId` must be valid IDs.
*   Container verification might require specific data (e.g., scan code).
*   Route optimization requires valid personnel ID and pending deliveries. 