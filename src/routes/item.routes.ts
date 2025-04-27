import { NextFunction, Request, Response, Router } from 'express';
import { ItemController } from '@controllers';
import { userVerifyJWT } from '../middleware/user.verifyJWT.middleware';
import BaseRoute from './base.routes';

class ItemRoute extends BaseRoute {
  public path: string;

  constructor(path: string) {
    super();
    this.path = path;
    this.init();
  }

  get instance(): Router {
    return this.router;
  }

  init() {
    // Apply JWT authentication to all routes
    this.router.use(userVerifyJWT);

    // *** IMPORTANT: Specific routes must come before parameter routes to avoid conflicts ***

    // *** Basic CRUD operations ***

    // Create a new item
    this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
      ItemController.createItem(req, res, next);
    });

    // *** Admin-specific operations ***

    // Get items by admin ID
    this.router.get('/admin/:adminId', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getItemsByAdminId(req, res, next);
    });

    // Get active items by admin ID
    this.router.get('/admin/:adminId/active', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getActiveItemsByAdminId(req, res, next);
    });

    // Get admin item summary
    this.router.get(
      '/admin/:adminId/summary',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getAdminItemSummary(req, res, next);
      },
    );

    // Count items by admin
    this.router.get('/admin/:adminId/count', (req: Request, res: Response, next: NextFunction) => {
      ItemController.countItemsByAdmin(req, res, next);
    });

    // *** Search and filtering operations ***

    // Search items
    this.router.get('/search', (req: Request, res: Response, next: NextFunction) => {
      ItemController.searchItems(req, res, next);
    });

    // Get items by category
    this.router.get('/category/:category', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getItemsByCategory(req, res, next);
    });

    // Get items by container type
    this.router.get(
      '/container-type/:containerType',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getItemsByContainerType(req, res, next);
      },
    );

    // Get items with dietary preferences
    this.router.get('/dietary-preferences', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getItemsWithDietaryPreferences(req, res, next);
    });

    // *** Pricing and subscription operations ***

    // Update item price
    this.router.put('/:itemId/price', (req: Request, res: Response, next: NextFunction) => {
      ItemController.updateItemPrice(req, res, next);
    });

    // Update item frequencies
    this.router.put('/:itemId/frequencies', (req: Request, res: Response, next: NextFunction) => {
      ItemController.updateItemFrequencies(req, res, next);
    });

    // Add item frequency
    this.router.post('/:itemId/frequency', (req: Request, res: Response, next: NextFunction) => {
      ItemController.addItemFrequency(req, res, next);
    });

    // Remove item frequency
    this.router.delete(
      '/:itemId/frequency/:frequency',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.removeItemFrequency(req, res, next);
      },
    );

    // Update item tax rate
    this.router.put('/:itemId/tax-rate', (req: Request, res: Response, next: NextFunction) => {
      ItemController.updateItemTaxRate(req, res, next);
    });

    // Get price for frequency
    this.router.get(
      '/:itemId/price/:frequency',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getPriceForFrequency(req, res, next);
      },
    );

    // *** Inventory operations ***

    // Update item stock
    this.router.put('/:itemId/stock', (req: Request, res: Response, next: NextFunction) => {
      ItemController.updateItemStock(req, res, next);
    });

    // Increment stock quantity
    this.router.put(
      '/:itemId/stock/increment',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.incrementStockQuantity(req, res, next);
      },
    );

    // Decrement stock quantity
    this.router.put(
      '/:itemId/stock/decrement',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.decrementStockQuantity(req, res, next);
      },
    );

    // Get items with low stock
    this.router.get('/low-stock', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getItemsWithLowStock(req, res, next);
    });

    // *** Category management ***

    // Get admin categories
    this.router.get(
      '/admin/:adminId/categories',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getAdminCategories(req, res, next);
      },
    );

    // Get item count by category
    this.router.get(
      '/admin/:adminId/category-count',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getItemCountByCategory(req, res, next);
      },
    );

    // *** Container-related operations ***

    // Update container settings
    this.router.put(
      '/:itemId/container-settings',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.updateContainerSettings(req, res, next);
      },
    );

    // Get container types
    this.router.get(
      '/admin/:adminId/container-types',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getContainerTypes(req, res, next);
      },
    );

    // Get items requiring deposit
    this.router.get(
      '/admin/:adminId/requiring-deposit',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getItemsRequiringDeposit(req, res, next);
      },
    );

    // *** Nutritional information operations ***

    // Update nutritional info
    this.router.put(
      '/:itemId/nutritional-info',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.updateNutritionalInfo(req, res, next);
      },
    );

    // Add allergen
    this.router.post('/:itemId/allergen', (req: Request, res: Response, next: NextFunction) => {
      ItemController.addAllergen(req, res, next);
    });

    // Remove allergen
    this.router.delete(
      '/:itemId/allergen/:allergen',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.removeAllergen(req, res, next);
      },
    );

    // Get items with allergens
    this.router.get('/allergens', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getItemsWithAllergens(req, res, next);
    });

    // *** Bulk operations and statistics ***

    // Bulk update prices
    this.router.put('/bulk/prices', (req: Request, res: Response, next: NextFunction) => {
      ItemController.bulkUpdatePrices(req, res, next);
    });

    // Bulk toggle active status
    this.router.put('/bulk/toggle-active', (req: Request, res: Response, next: NextFunction) => {
      ItemController.bulkToggleActiveStatus(req, res, next);
    });

    // Get popular items
    this.router.get(
      '/admin/:adminId/popular',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getPopularItems(req, res, next);
      },
    );

    // Get recent items
    this.router.get('/admin/:adminId/recent', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getRecentItems(req, res, next);
    });

    // Get item stats by container type
    this.router.get(
      '/admin/:adminId/container-stats',
      (req: Request, res: Response, next: NextFunction) => {
        ItemController.getItemStatsByContainerType(req, res, next);
      },
    );

    // *** Status management ***

    // Toggle item active status
    this.router.put('/:itemId/toggle-active', (req: Request, res: Response, next: NextFunction) => {
      ItemController.toggleItemActiveStatus(req, res, next);
    });

    // *** Item-specific operations with parameters ***

    // Get item by ID
    this.router.get('/:itemId', (req: Request, res: Response, next: NextFunction) => {
      ItemController.getItemById(req, res, next);
    });

    // Update item
    this.router.put('/:itemId', (req: Request, res: Response, next: NextFunction) => {
      ItemController.updateItem(req, res, next);
    });

    // Delete item
    this.router.delete('/:itemId', (req: Request, res: Response, next: NextFunction) => {
      ItemController.removeItemById(req, res, next);
    });
  }
}

export default new ItemRoute('/items');
