import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  badges: string[];
}

export interface Badge {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  requirement: string;
  points: number;
}

const BADGES: Badge[] = [
  {
    id: 'first_quiz',
    name: 'First Steps',
    nameAr: 'الخطوات الأولى',
    description: 'Complete your first quiz',
    descriptionAr: 'أكمل أول اختبار',
    icon: '🎯',
    requirement: 'quiz_count >= 1',
    points: 10,
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    nameAr: 'العلامة الكاملة',
    description: 'Get 100% on any quiz',
    descriptionAr: 'احصل على 100% في أي اختبار',
    icon: '💯',
    requirement: 'perfect_score_count >= 1',
    points: 50,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    nameAr: 'محارب الأسبوع',
    description: 'Login 7 days in a row',
    descriptionAr: 'سجل دخول 7 أيام متتالية',
    icon: '🔥',
    requirement: 'streak >= 7',
    points: 30,
  },
  {
    id: 'top_10',
    name: 'Rising Star',
    nameAr: 'نجم صاعد',
    description: 'Reach top 10 on leaderboard',
    descriptionAr: 'وصول لأفضل 10 في لوحة الشرف',
    icon: '⭐',
    requirement: 'rank <= 10',
    points: 100,
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    nameAr: 'سيد الاختبارات',
    description: 'Complete 50 quizzes',
    descriptionAr: 'أكمل 50 اختبار',
    icon: '🏆',
    requirement: 'quiz_count >= 50',
    points: 200,
  },
];

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get available badges
   */
  getBadges(): Badge[] {
    return BADGES;
  }

  /**
   * Get leaderboard (top N students by points)
   */
  getLeaderboard(
    limit: number = 10,
    _classId?: string,
  ): Promise<LeaderboardEntry[]> {
    void _classId;
    try {
      // This is a placeholder implementation
      // In production, you would query actual user points from the database
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          rank: 1,
          userId: '1',
          name: 'أحمد محمد',
          points: 1250,
          badges: ['perfect_score', 'quiz_master'],
        },
        {
          rank: 2,
          userId: '2',
          name: 'فاطمة علي',
          points: 1180,
          badges: ['streak_7', 'top_10'],
        },
        {
          rank: 3,
          userId: '3',
          name: 'محمد أحمد',
          points: 1050,
          badges: ['first_quiz', 'perfect_score'],
        },
        {
          rank: 4,
          userId: '4',
          name: 'سارة حسن',
          points: 980,
          badges: ['streak_7'],
        },
        {
          rank: 5,
          userId: '5',
          name: 'عمر خالد',
          points: 920,
          badges: ['first_quiz'],
        },
      ];

      return Promise.resolve(mockLeaderboard.slice(0, limit));
    } catch (error) {
      this.logger.error('Failed to get leaderboard', error);
      throw error;
    }
  }

  /**
   * Get user's rank and points
   */
  getUserRank(
    _userId: string,
  ): Promise<{ rank: number; points: number; badges: Badge[] }> {
    void _userId;
    // Placeholder implementation
    return Promise.resolve({
      rank: 5,
      points: 920,
      badges: BADGES.filter((b) =>
        ['first_quiz', 'perfect_score'].includes(b.id),
      ),
    });
  }

  /**
   * Award points to user
   */
  awardPoints(userId: string, points: number, reason: string): Promise<void> {
    this.logger.log(`Awarded ${points} points to user ${userId}: ${reason}`);
    // In production, update the user's points in the database
    return Promise.resolve();
  }

  /**
   * Award badge to user
   */
  awardBadge(userId: string, badgeId: string): Promise<Badge | null> {
    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return Promise.resolve(null);

    this.logger.log(`Awarded badge ${badgeId} to user ${userId}`);
    // In production, add badge to user's badge collection
    return Promise.resolve(badge);
  }

  /**
   * Check and award eligible badges
   */
  async checkBadges(
    userId: string,
    stats: Record<string, number>,
  ): Promise<Badge[]> {
    const earnedBadges: Badge[] = [];

    for (const badge of BADGES) {
      const earned = this.checkBadgeRequirement(badge.requirement, stats);
      if (earned) {
        const awarded = await this.awardBadge(userId, badge.id);
        if (awarded) earnedBadges.push(awarded);
      }
    }

    return earnedBadges;
  }

  private checkBadgeRequirement(
    requirement: string,
    stats: Record<string, number>,
  ): boolean {
    // Simple requirement parser
    const match = requirement.match(/(\w+)\s*(>=|<=|>|<|==)\s*(\d+)/);
    if (!match) return false;

    const [, field, operator, valueStr] = match;
    const statValue = stats[field] || 0;
    const requiredValue = parseInt(valueStr);

    switch (operator) {
      case '>=':
        return statValue >= requiredValue;
      case '<=':
        return statValue <= requiredValue;
      case '>':
        return statValue > requiredValue;
      case '<':
        return statValue < requiredValue;
      case '==':
        return statValue === requiredValue;
      default:
        return false;
    }
  }
}
