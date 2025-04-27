import { NextFunction, Request, Response } from 'express';
import builder from '@builders';
import { ItemEntities } from '@entity';
import { RESPONSE } from '@response';
import BaseController from './base.controller';

class ItemControllerClass extends BaseController {
  constructor() {
    super();
  }

  // *** Basic CRUD operations ***

  // Create a new item
  public async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ItemEntities.addItem(req.body);
      return this.sendResponse(res, item, RESPONSE.ITEM('Item created successfully').ITEM_CREATED);
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get item by ID
  public async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const item = await ItemEntities.getItemById(itemId);

      return item
        ? this.sendResponse(res, item, RESPONSE.ITEM('Item found').ITEM_FOUND)
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update item
  public async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const item = await ItemEntities.updateItem(itemId, req.body);

      return item
        ? this.sendResponse(res, item, RESPONSE.ITEM('Item updated').ITEM_UPDATED)
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete item
  public async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const result = await ItemEntities.removeItemById(itemId);

      return result?.success
        ? this.sendResponse(res, { deleted: true }, RESPONSE.ITEM('Item deleted').ITEM_DELETED)
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Admin-specific operations ***

  // Get items by admin ID
  public async getItemsByAdminId(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const items = await ItemEntities.getItemsByAdminId(adminId);

      return this.sendResponse(
        res,
        items,
        RESPONSE.ITEM('Items retrieved successfully').ITEMS_RETRIEVED,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get active items by admin ID
  public async getActiveItemsByAdminId(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const items = await ItemEntities.getActiveItemsByAdminId(adminId);

      return this.sendResponse(res, items, RESPONSE.ITEM('Active items retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Toggle item active status
  public async toggleItemActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { isActive } = req.body;

      if (isActive === undefined) {
        return this.badRequest(res, 'isActive status is required');
      }

      const result = await ItemEntities.toggleItemActiveStatus(itemId, isActive);
      return result
        ? this.sendResponse(
            res,
            { updated: true, isActive },
            RESPONSE.ITEM(`Item ${isActive ? 'activated' : 'deactivated'}`),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Count items by admin
  public async countItemsByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const count = await ItemEntities.countItemsByAdmin(adminId);

      return this.sendResponse(res, { count }, RESPONSE.ITEM('Items counted successfully'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get admin item summary
  public async getAdminItemSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const summary = await ItemEntities.getAdminItemSummary(adminId);

      return this.sendResponse(res, summary, RESPONSE.ITEM('Item summary retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Search and filtering operations ***

  // Search items
  public async searchItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, adminId, activeOnly = true } = req.query;
      const filters = req.body.filters || {};

      if (!query) {
        return this.badRequest(res, 'Search query is required');
      }

      const items = await ItemEntities.searchItems(
        query as string,
        filters,
        adminId as string,
        activeOnly === 'true' || activeOnly === true,
      );

      return this.sendResponse(res, items, RESPONSE.ITEM('Items retrieved successfully'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get items by category
  public async getItemsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const { adminId } = req.query;

      const items = await ItemEntities.getItemsByCategory(category, adminId as string);

      return this.sendResponse(res, items, RESPONSE.ITEM('Items retrieved by category'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get items by container type
  public async getItemsByContainerType(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerType } = req.params;
      const { adminId } = req.query;

      const items = await ItemEntities.getItemsByContainerType(containerType, adminId as string);

      return this.sendResponse(res, items, RESPONSE.ITEM('Items retrieved by container type'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get items with dietary preferences
  public async getItemsWithDietaryPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { vegetarian, vegan, glutenFree } = req.query;
      const { adminId } = req.query;

      const preferences = {
        vegetarian: vegetarian === 'true',
        vegan: vegan === 'true',
        glutenFree: glutenFree === 'true',
      };

      const items = await ItemEntities.getItemsWithDietaryPreferences(
        preferences,
        adminId as string,
      );

      return this.sendResponse(
        res,
        items,
        RESPONSE.ITEM('Items retrieved with dietary preferences'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Pricing and subscription operations ***

  // Update item price
  public async updateItemPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { price, discountedPrice } = req.body;

      if (price === undefined) {
        return this.badRequest(res, 'Price is required');
      }

      const result = await ItemEntities.updateItemPrice(itemId, price, discountedPrice);

      return result
        ? this.sendResponse(
            res,
            { updated: true, price, discountedPrice },
            RESPONSE.ITEM('Item price updated'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update item frequencies
  public async updateItemFrequencies(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { frequencies } = req.body;

      if (!frequencies || !Array.isArray(frequencies)) {
        return this.badRequest(res, 'Valid frequencies array is required');
      }

      const result = await ItemEntities.updateItemFrequencies(itemId, frequencies);

      return result
        ? this.sendResponse(
            res,
            { updated: true, frequencies },
            RESPONSE.ITEM('Item frequencies updated'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add item frequency
  public async addItemFrequency(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { frequency, price } = req.body;

      if (!frequency || price === undefined) {
        return this.badRequest(res, 'Frequency and price are required');
      }

      const result = await ItemEntities.addItemFrequency(itemId, frequency, price);

      return result
        ? this.sendResponse(
            res,
            { updated: true, frequency, price },
            RESPONSE.ITEM('Item frequency added'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove item frequency
  public async removeItemFrequency(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { frequency } = req.body;

      if (!frequency) {
        return this.badRequest(res, 'Frequency is required');
      }

      const result = await ItemEntities.removeItemFrequency(itemId, frequency);

      return result
        ? this.sendResponse(
            res,
            { updated: true, frequency },
            RESPONSE.ITEM('Item frequency removed'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update item tax rate
  public async updateItemTaxRate(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { taxRate } = req.body;

      if (taxRate === undefined) {
        return this.badRequest(res, 'Tax rate is required');
      }

      const result = await ItemEntities.updateItemTaxRate(itemId, taxRate);

      return result
        ? this.sendResponse(res, { updated: true, taxRate }, RESPONSE.ITEM('Item tax rate updated'))
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get price for frequency
  public async getPriceForFrequency(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId, frequency } = req.params;

      const price = await ItemEntities.getPriceForFrequency(itemId, frequency);

      return price !== null
        ? this.sendResponse(
            res,
            { itemId, frequency, price },
            RESPONSE.ITEM('Price retrieved for frequency'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Inventory operations ***

  // Update item stock
  public async updateItemStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { inStock, quantity } = req.body;

      if (inStock === undefined) {
        return this.badRequest(res, 'In stock status is required');
      }

      const result = await ItemEntities.updateItemStock(itemId, inStock, quantity);

      return result
        ? this.sendResponse(
            res,
            { updated: true, inStock, quantity },
            RESPONSE.ITEM('Item stock updated'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Increment stock quantity
  public async incrementStockQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { amount } = req.body;

      if (amount === undefined || amount <= 0) {
        return this.badRequest(res, 'Valid positive amount is required');
      }

      const result = await ItemEntities.incrementStockQuantity(itemId, amount);

      return result
        ? this.sendResponse(
            res,
            { updated: true, amount },
            RESPONSE.ITEM('Stock quantity incremented'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Decrement stock quantity
  public async decrementStockQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { amount } = req.body;

      if (amount === undefined || amount <= 0) {
        return this.badRequest(res, 'Valid positive amount is required');
      }

      const result = await ItemEntities.decrementStockQuantity(itemId, amount);

      if (!result) {
        return this.badRequest(res, result);
      }

      return this.sendResponse(
        res,
        { updated: true, amount },
        RESPONSE.ITEM('Stock quantity decremented'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get items with low stock
  public async getItemsWithLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { threshold } = req.params;
      const { adminId } = req.query;

      const thresholdNum = parseInt(threshold);

      if (isNaN(thresholdNum)) {
        return this.badRequest(res, 'Valid threshold number is required');
      }

      const items = await ItemEntities.getItemsWithLowStock(thresholdNum, adminId as string);

      return this.sendResponse(res, items, RESPONSE.ITEM('Low stock items retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Category management ***

  // Get admin categories
  public async getAdminCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const categories = await ItemEntities.getAdminCategories(adminId);

      return this.sendResponse(res, categories, RESPONSE.ITEM('Categories retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get item count by category
  public async getItemCountByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const counts = await ItemEntities.getItemCountByCategory(adminId);

      return this.sendResponse(res, counts, RESPONSE.ITEM('Item counts by category retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Container-related operations ***

  // Update container settings
  public async updateContainerSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { containerType, requiresReturn, depositAmount } = req.body;

      if (!containerType || requiresReturn === undefined) {
        return this.badRequest(res, 'Container type and requiresReturn status are required');
      }

      const result = await ItemEntities.updateContainerSettings(
        itemId,
        containerType,
        requiresReturn,
        depositAmount || 0,
      );

      return result
        ? this.sendResponse(
            res,
            { updated: true, containerType, requiresReturn, depositAmount },
            RESPONSE.ITEM('Container settings updated'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container types
  public async getContainerTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const types = await ItemEntities.getContainerTypes(adminId);

      return this.sendResponse(res, types, RESPONSE.ITEM('Container types retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get items requiring deposit
  public async getItemsRequiringDeposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const items = await ItemEntities.getItemsRequiringDeposit(adminId);

      return this.sendResponse(res, items, RESPONSE.ITEM('Deposit-requiring items retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Nutritional information operations ***

  // Update nutritional info
  public async updateNutritionalInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const nutritionalInfo = req.body;

      if (!nutritionalInfo) {
        return this.badRequest(res, 'Nutritional info is required');
      }

      const result = await ItemEntities.updateNutritionalInfo(itemId, nutritionalInfo);

      return result
        ? this.sendResponse(
            res,
            { updated: true, nutritionalInfo },
            RESPONSE.ITEM('Nutritional info updated'),
          )
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add allergen
  public async addAllergen(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { allergen } = req.body;

      if (!allergen) {
        return this.badRequest(res, 'Allergen is required');
      }

      const result = await ItemEntities.addAllergen(itemId, allergen);

      return result
        ? this.sendResponse(res, { updated: true, allergen }, RESPONSE.ITEM('Allergen added'))
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove allergen
  public async removeAllergen(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { allergen } = req.body;

      if (!allergen) {
        return this.badRequest(res, 'Allergen is required');
      }

      const result = await ItemEntities.removeAllergen(itemId, allergen);

      return result
        ? this.sendResponse(res, { updated: true, allergen }, RESPONSE.ITEM('Allergen removed'))
        : this.notFound(res, 'Item not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get items with allergens
  public async getItemsWithAllergens(req: Request, res: Response, next: NextFunction) {
    try {
      const allergens = req.body.allergens;
      const { adminId } = req.query;

      if (!allergens || !Array.isArray(allergens) || allergens.length === 0) {
        return this.badRequest(res, 'Valid allergens array is required');
      }

      const items = await ItemEntities.getItemsWithAllergens(allergens, adminId as string);

      return this.sendResponse(res, items, RESPONSE.ITEM('Items with allergens retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Bulk operations and statistics ***

  // Bulk update prices
  public async bulkUpdatePrices(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = req.body.updates;

      if (!updates || !Array.isArray(updates) || updates.length === 0) {
        return this.badRequest(res, 'Valid updates array is required');
      }

      const result = await ItemEntities.bulkUpdatePrices(updates);

      return this.sendResponse(res, result, RESPONSE.ITEM(`${result.modifiedCount} items updated`));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Bulk toggle active status
  public async bulkToggleActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemIds, isActive } = req.body;

      if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0 || isActive === undefined) {
        return this.badRequest(res, 'Valid item IDs array and active status are required');
      }

      const result = await ItemEntities.bulkToggleActiveStatus(itemIds, isActive);

      return this.sendResponse(res, result, RESPONSE.ITEM(`${result.modifiedCount} items updated`));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get popular items
  public async getPopularItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const { limit } = req.query;

      const limitNum = limit ? parseInt(limit as string) : 5;

      const items = await ItemEntities.getPopularItems(adminId, limitNum);

      return this.sendResponse(res, items, RESPONSE.ITEM('Popular items retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get recent items
  public async getRecentItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const { limit } = req.query;

      const limitNum = limit ? parseInt(limit as string) : 5;

      const items = await ItemEntities.getRecentItems(adminId, limitNum);

      return this.sendResponse(res, items, RESPONSE.ITEM('Recent items retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get item stats by container type
  public async getItemStatsByContainerType(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const stats = await ItemEntities.getItemStatsByContainerType(adminId);

      return this.sendResponse(res, stats, RESPONSE.ITEM('Container type stats retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Aggregate items
  public async aggregateItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const body = req.body;

      const pipline = builder.ITEM.buildItemQuery({
        ...body,
        adminId,
      });

      const options = {
        page: 1,
        limit: 10,
        getCount: true,
      };

      const result = await ItemEntities.paginateAggregate(pipline, options);

      return this.sendResponse(res, result, RESPONSE.ITEM('Items aggregated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // removeItemById
  public async removeItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const result = await ItemEntities.removeItemById(itemId);

      return this.sendResponse(res, result, RESPONSE.ITEM('Item removed'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }
}

export const ItemController = new ItemControllerClass();
