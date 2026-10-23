import { repositories } from '@/app/composition/repositories';

export const connectionService = {
  getConnections: () => repositories.connection.getConnections(),
  getById: (id: string) => repositories.connection.getConnectionById(id),
  end: (id: string) => repositories.connection.endConnection(id),
  archive: (id: string) => repositories.connection.archiveConnection(id),
};
