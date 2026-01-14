import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  Association,
} from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { RoutineCompletion } from './RoutineCompletion';

/**
 * Enum for routine categories
 */
export enum RoutineCategory {
  HEALTH = 'health',
  FITNESS = 'fitness',
  PRODUCTIVITY = 'productivity',
  LEARNING = 'learning',
  PERSONAL = 'personal',
  WORK = 'work',
  SOCIAL = 'social',
  CREATIVE = 'creative',
  OTHER = 'other',
}

/**
 * Enum for routine frequency types
 */
export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

/**
 * Enum for routine difficulty levels
 */
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/**
 * Interface for custom frequency configuration
 */
export interface CustomFrequency {
  type: 'specific_days' | 'interval';
  days?: number[]; // 0-6 (Sunday-Saturday) for specific days
  interval?: number; // Every N days for interval type
}

/**
 * Routine model representing user routines/habits
 */
export class Routine extends Model<
  InferAttributes<Routine>,
  InferCreationAttributes<Routine>
> {
  // Primary key
  declare id: CreationOptional<number>;

  // Foreign key
  declare userId: ForeignKey<User['id']>;

  // Basic routine information
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare category: RoutineCategory;
  declare difficulty: CreationOptional<DifficultyLevel>;

  // Scheduling
  declare frequencyType: FrequencyType;
  declare customFrequency: CreationOptional<CustomFrequency | null>;
  declare targetDuration: CreationOptional<number | null>; // in minutes
  declare reminderTime: CreationOptional<string | null>; // HH:MM format

  // Status and tracking
  declare isActive: CreationOptional<boolean>;
  declare startDate: Date;
  declare endDate: CreationOptional<Date | null>;
  declare currentStreak: CreationOptional<number>;
  declare longestStreak: CreationOptional<number>;
  declare totalCompletions: CreationOptional<number>;

  // Gamification
  declare points: CreationOptional<number>;
  declare color: CreationOptional<string | null>; // Hex color for UI
  declare icon: CreationOptional<string | null>; // Icon identifier

  // Timestamps
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association methods
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare getRoutineCompletions: HasManyGetAssociationsMixin<RoutineCompletion>;

  // Associations
  declare static associations: {
    user: Association<Routine, User>;
    routineCompletions: Association<Routine, RoutineCompletion>;
  };

  /**
   * Calculate completion rate for a given period
   * @param days - Number of days to look back
   * @returns Promise<number> - Completion rate as percentage
   */
  async getCompletionRate(days: number = 30): Promise<number> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const completions = await RoutineCompletion.count({
      where: {
        routineId: this.id,
        completedAt: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    // Calculate expected completions based on frequency
    let expectedCompletions = days;
    if (this.frequencyType === FrequencyType.WEEKLY) {
      expectedCompletions = Math.floor(days / 7);
    } else if (this.frequencyType === FrequencyType.MONTHLY) {
      expectedCompletions = Math.floor(days / 30);
    }

    return expectedCompletions > 0 ? (completions / expectedCompletions) * 100 : 0;
  }

  /**
   * Check if routine should be completed today
   * @returns boolean - Whether routine is due today
   */
  isDueToday(): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    switch (this.frequencyType) {
      case FrequencyType.DAILY:
        return true;
      case FrequencyType.WEEKLY:
        return dayOfWeek === 1; // Monday
      case FrequencyType.MONTHLY:
        return today.getDate() === 1; // First day of month
      case FrequencyType.CUSTOM:
        if (this.customFrequency?.type === 'specific_days') {
          return this.customFrequency.days?.includes(dayOfWeek) || false;
        }
        // For interval type, would need to check against last completion
        return false;
      default:
        return false;
    }
  }

  /**
   * Update streak counters
   * @param completed - Whether routine was completed
   */
  async updateStreak(completed: boolean): Promise<void> {
    if (completed) {
      this.currentStreak = (this.currentStreak || 0) + 1;
      this.longestStreak = Math.max(
        this.longestStreak || 0,
        this.currentStreak
      );
      this.totalCompletions = (this.totalCompletions || 0) + 1;
      this.points = (this.points || 0) + this.getPointsForCompletion();
    } else {
      this.currentStreak = 0;
    }
    await this.save();
  }

  /**
   * Calculate points awarded for completion
   * @returns number - Points to award
   */
  private getPointsForCompletion(): number {
    const basePoints = 10;
    const difficultyMultiplier = {
      [DifficultyLevel.EASY]: 1,
      [DifficultyLevel.MEDIUM]: 1.5,
      [DifficultyLevel.HARD]: 2,
    };
    
    const streakBonus = Math.floor((this.currentStreak || 0) / 7) * 5; // 5 points per week streak
    
    return Math.floor(
      basePoints * (difficultyMultiplier[this.difficulty] || 1) + streakBonus
    );
  }
}

// Initialize Routine model
Routine.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: {
          args: [1, 200],
          msg: 'Title must be between 1 and 200 characters',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Description cannot exceed 1000 characters',
        },
      },
    },
    category: {
      type: DataTypes.ENUM(...Object.values(RoutineCategory)),
      allowNull: false,
      defaultValue: RoutineCategory.PERSONAL,
    },
    difficulty: {
      type: DataTypes.ENUM(...Object.values(DifficultyLevel)),
      allowNull: false,
      defaultValue: DifficultyLevel.MEDIUM,
    },
    frequencyType: {
      type: DataTypes.ENUM(...Object.values(FrequencyType)),
      allowNull: false,
      defaultValue: FrequencyType.DAILY,
    },
    customFrequency: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidCustomFrequency(value: any) {
          if (value && this.frequencyType === FrequencyType.CUSTOM) {
            if (!value.type || !['specific_days', 'interval'].includes(value.type)) {
              throw new Error('Invalid custom frequency type');
            }
            if (value.type === 'specific_days' && !Array.isArray(value.days)) {
              throw new Error('Days must be an array for specific_days type');
            }
            if (value.type === 'interval' && typeof value.interval !== 'number') {
              throw new Error('Interval must be a number for interval type');
            }
          }
        },
      },
    },
    targetDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'Target duration must be at least 1 minute',
        },
        max: {
          args: [1440],
          msg: 'Target duration cannot exceed 24 hours',
        },
      },
    },
    reminderTime: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        is: {
          args: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: 'Reminder time must be in HH:MM format',
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isAfterStartDate(value: Date) {
          if (value && this.startDate && value <= this.startDate) {
            throw new Error('End date must be after start date');
          }
        },
      },
    },
    currentStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Current streak cannot be negative',
        },
      },
    },
    longestStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Longest streak cannot be negative',
        },
      },
    },
    totalCompletions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Total completions cannot be negative',
        },
      },
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Points cannot be negative',
        },
      },
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: {
          args: /^#[0-9A-Fa-f]{6}$/,
          msg: 'Color must be a valid hex color code',
        },
      },
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Routine',
    tableName: 'routines',
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['startDate'],
      },
      {
        fields: ['frequencyType'],
      },
      {
        fields: ['userId', 'isActive'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);