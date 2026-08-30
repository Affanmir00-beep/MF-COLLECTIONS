const encodeCursor = (doc) => Buffer.from(`${doc.createdAt.toISOString()}_${doc._id}`).toString('base64');

const decodeCursor = (cursor) => {
  const [createdAt, id] = Buffer.from(cursor, 'base64').toString('utf8').split('_');
  return { createdAt: new Date(createdAt), id };
};

async function paginateByCursor(Model, filter, { cursor, limit = 10, sortDir = -1, populate = [] }) {
  const query = { ...filter, status: 'published' };
  
  if (cursor) {
    const { createdAt, id } = decodeCursor(cursor);
    query.$or = [
      { createdAt: { [sortDir === -1 ? '$lt' : '$gt']: createdAt } },
      { createdAt, _id: { [sortDir === -1 ? '$lt' : '$gt']: id } }
    ];
  }
  
  let mQuery = Model.find(query).sort({ createdAt: sortDir, _id: sortDir }).limit(limit + 1);
  if (populate.length) {
    populate.forEach(p => mQuery = mQuery.populate(p));
  }
  
  const items = await mQuery;
  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  
  return { 
    items: page, 
    nextCursor: hasMore ? encodeCursor(page[page.length - 1]) : null 
  };
}

module.exports = {
  encodeCursor,
  decodeCursor,
  paginateByCursor
};
