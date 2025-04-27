# Container API Documentation

This document provides detailed information about the `/api/containers` endpoints.

## Endpoints

*   **GET /containers**: Retrieve all containers.
    *   Query Parameters: (e.g., `status`, `type`, `limit`, `page`)
    *   Response: Array of container objects.
*   **GET /containers/{containerId}**: Retrieve a specific container.
    *   Response: Single container object.
*   **GET /containers/type/{type}**: Retrieve containers by type.
*   **GET /containers/status/{status}**: Retrieve containers by status.
*   **GET /containers/stats**: Retrieve container statistics.
*   **PUT /containers/{containerId}/transit-out**: Update status to 'in transit to subscriber'.
*   **PUT /containers/{containerId}/with-subscriber**: Update status to 'with subscriber'.
*   **PUT /containers/{containerId}/transit-in**: Update status to 'in transit to warehouse'.
*   **PUT /containers/{containerId}/returned**: Update status to 'returned'.
*   **POST /containers/{containerId}/maintenance**: Record maintenance log.
*   **PUT /containers/{containerId}/cleaned**: Update status to 'cleaned'.
*   **PUT /containers/{containerId}/condition**: Update container condition details.
*   **PUT /containers/{containerId}/under-maintenance**: Update status to 'under maintenance'.
*   **PUT /containers/{containerId}/inventory**: Update status to 'in inventory'.
*   **PUT /containers/{containerId}/deposit/collect**: Mark deposit as collected.
*   **PUT /containers/{containerId}/deposit/refund**: Mark deposit as refunded.
*   **PUT /containers/{containerId}/lost**: Update status to 'lost'.

## Container Status Lifecycle

*   `in_inventory` -> `transit_out` -> `with_subscriber` -> `transit_in` -> `returned`
*   From `returned`: -> `under_maintenance` -> `cleaned` -> `in_inventory`
*   Any state can potentially transition to `lost`.

## Request/Response Examples

```json
// Example GET /containers/{containerId} response
{
  "_id": "60d...",
  "containerCode": "C001",
  "type": "Standard",
  "status": "in_inventory",
  "condition": "Good",
  "depositStatus": "pending",
  "lastMaintenance": null,
  "history": [...]
}
```

## Validation Rules

*   `containerId` must be a valid MongoDB ObjectId.
*   Status transitions must follow the defined lifecycle.
*   Condition updates require specific fields. 