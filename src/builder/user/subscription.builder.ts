export const searchProducts = (payload: any) => {
  const pipeline = [];
  let sortOrder = 1; // Default to ascending sort unless specified

  const matchCriteria: any = { $match: {} };

  if (payload.search) {
    matchCriteria.$match.$or = [
      { name: { $regex: payload.search, $options: 'i' } },
      { description: { $regex: payload.search, $options: 'i' } },
      { category: { $regex: payload.search, $options: 'i' } },
      { 'supplierInfo.shopName': { $regex: payload.search, $options: 'i' } },
    ];
  }

  if (payload.priceRange) {
    matchCriteria.$match.price = { $gte: payload.priceRange[0], $lte: payload.priceRange[1] };
  }

  if (payload.availableFor) {
    matchCriteria.$match.availableFor = { $in: payload.availableFor };
  }

  if (payload.category) {
    matchCriteria.$match.category = payload.category;
  }

  if (payload.stockStatus) {
    matchCriteria.$match.quantity = payload.stockStatus === 'inStock' ? { $gt: 0 } : { $eq: 0 };
  }

  if (Object.keys(matchCriteria.$match).length > 0) {
    pipeline.push(matchCriteria);
  }

  if (payload.sort) {
    const sortField = payload.sort.field || 'name'; // Default sort by name
    sortOrder = payload.sort.order === 'desc' ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });
  }

  return pipeline;
};
