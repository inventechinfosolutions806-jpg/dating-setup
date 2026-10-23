import type { Connection, ConnectionStatus } from '@/domain/models/connection';

export interface ConnectionRepository {
  getConnections(): Promise<Connection[]>;
  getConnectionById(id: string): Promise<Connection | null>;
  endConnection(id: string): Promise<void>;
  archiveConnection(id: string): Promise<void>;
}
