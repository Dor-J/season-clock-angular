export const storageService = {
  query,
  get,
  post,
  put,
  remove,
};

function query<T>(entityType: string, delay = 500): Promise<T[]> {
  const data = localStorage.getItem(entityType) || '[]';
  const entities = JSON.parse(data);
  return new Promise((resolve) => setTimeout(() => resolve(entities), delay));
}

async function get<T extends { id: any }>(
  entityType: string,
  entityId: string
): Promise<T> {
  const entities = await query<T>(entityType);
  const entity = entities.find((entity) => entity.id === entityId);

  if (!entity)
    throw new Error(
      `Get failed, cannot find entity with id: ${entityId} in: ${entityType}`
    );
  return entity;
}

async function post<T extends { id?: string }>(
  entityType: string,
  newEntity: T
): Promise<T> {
  newEntity = { ...newEntity };
  newEntity.id = _makeId();
  const entities = await query<T>(entityType);
  entities.push(newEntity);
  _save(entityType, entities);
  return newEntity;
}

async function put<T extends { id: any }>(
  entityType: string,
  updatedEntity: T
): Promise<T> {
  const entities = await query<T>(entityType);
  const idx = entities.findIndex((entity) => entity.id === updatedEntity.id);

  if (idx < 0)
    throw new Error(
      `Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`
    );
  entities.splice(idx, 1, updatedEntity);
  _save(entityType, entities);
  return updatedEntity;
}

async function remove(entityType: string, entityId: any): Promise<void> {
  const entities = await query<any>(entityType);
  const idx = entities.findIndex(
    (entity: { id: any }) => entity.id === entityId
  );
  if (idx < 0)
    throw new Error(
      `Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`
    );
  entities.splice(idx, 1);
  _save(entityType, entities);
}

// Private functions

function _save(entityType: string, entities: unknown) {
  localStorage.setItem(entityType, JSON.stringify(entities));
}

function _makeId(length = 6) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
