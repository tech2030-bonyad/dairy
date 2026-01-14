import { Sequelize } from 'sequelize';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Database configuration and connection setup
 * Uses SQLite for development and production
 */
class DatabaseConfig {
  public sequelize: Sequelize;
  private readonly dbPath: string;

  constructor() {
    // Set database path based on environment
    const environment = process.env.NODE_ENV || 'development';
    this.dbPath = path.join(
      __dirname, 
      '../../database', 
      `${environment}.sqlite`
    );

    // Initialize Sequelize with SQLite
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: this.dbPath,
      logging: environment === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      throw error;
    }
  }

  /**
   * Sync database models
   * @param force - Whether to drop existing tables
   */
  async syncDatabase(force: boolean = false): Promise<void> {
    try {
      await this.sequelize.sync({ force });
      console.log('✅ Database synchronized successfully.');
    } catch (error) {
      console.error('❌ Database synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async closeConnection(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('✅ Database connection closed.');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseConfig = new DatabaseConfig();
export const sequelize = databaseConfig.sequelize;