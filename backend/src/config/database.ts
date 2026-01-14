import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';

/**
 * Database configuration and connection setup
 * Uses SQLite for development and production
 */
class Database {
  public sequelize: Sequelize;

  constructor() {
    // Initialize Sequelize with SQLite
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite',
      logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      logger.info('Database connection established successfully');
      return true;
    } catch (error) {
      logger.error('Unable to connect to database:', error);
      return false;
    }
  }

  /**
   * Synchronize database models
   */
  async sync(force: boolean = false): Promise<void> {
    try {
      await this.sequelize.sync({ force });
      logger.info('Database synchronized successfully');
    } catch (error) {
      logger.error('Database synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    try {
      await this.sequelize.close();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database connection:', error);
      throw error;
    }
  }

  /**
   * Get database connection status and response time
   */
  async getStatus(): Promise<{ status: 'connected' | 'disconnected'; responseTime?: number }> {
    try {
      const startTime = Date.now();
      await this.sequelize.authenticate();
      const responseTime = Date.now() - startTime;
      return { status: 'connected', responseTime };
    } catch (error) {
      return { status: 'disconnected' };
    }
  }
}

export const database = new Database();
export { Sequelize } from 'sequelize';