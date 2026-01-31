import millionService from './million.service';
import { query } from '../../config/database';

// Mock the database module
jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('MillionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create a new room successfully', async () => {
      const hostId = '123e4567-e89b-12d3-a456-426614174000';
      const title = 'غرفة العلوم';
      const type = 'public';
      const settings = { questionCount: 10, timeLimit: 15 };

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'room-123',
            title,
            host_id: hostId,
            status: 'waiting',
            type,
            settings,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      const room = await millionService.createRoom(
        hostId,
        title,
        type as any,
        settings,
      );

      expect(room).toBeDefined();
      expect(room.title).toBe(title);
      expect(room.host_id).toBe(hostId);
      expect(room.type).toBe(type);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO million_rooms'),
        expect.arrayContaining([hostId, title, type]),
      );
    });

    it('should create room with default settings', async () => {
      const hostId = '123e4567-e89b-12d3-a456-426614174000';
      const title = 'غرفة اختبار';
      const type = 'private';

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'room-456',
            title,
            host_id: hostId,
            status: 'waiting',
            type,
            settings: {
              maxPlayers: 10,
              questionCount: 10,
              timeLimit: 15,
              difficulty: 'mixed',
            },
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      const room = await millionService.createRoom(hostId, title, type as any);

      expect(room).toBeDefined();
      expect(room.settings).toBeDefined();
    });
  });

  describe('joinRoom', () => {
    it('should allow user to join an existing room', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';

      // Mock room exists
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: roomId,
            host_id: 'host-123',
            status: 'waiting',
            settings: { maxPlayers: 10 },
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock participant count
      mockQuery.mockResolvedValueOnce({
        rows: [{ count: 3 }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock check if already joined
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock add participant
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      // Mock get room again
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: roomId,
            host_id: 'host-123',
            status: 'waiting',
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      const room = await millionService.joinRoom(userId, roomId);

      expect(room).toBeDefined();
      expect(room.id).toBe(roomId);
    });

    it('should throw error if room is full', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';

      // Mock room exists with maxPlayers: 5
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: roomId,
            settings: { maxPlayers: 5 },
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock participant count is already 5
      mockQuery.mockResolvedValueOnce({
        rows: [{ count: 5 }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(millionService.joinRoom(userId, roomId)).rejects.toThrow(
        'Room is full',
      );
    });

    it('should throw error if room not found', async () => {
      const userId = 'user-123';
      const roomId = 'nonexistent-room';

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(millionService.joinRoom(userId, roomId)).rejects.toThrow(
        'Room not found',
      );
    });

    it('should throw error if user already in room', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';

      // Mock room exists
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: roomId,
            settings: { maxPlayers: 10 },
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock participant count
      mockQuery.mockResolvedValueOnce({
        rows: [{ count: 3 }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock already joined
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: userId }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(millionService.joinRoom(userId, roomId)).rejects.toThrow(
        'Already in room',
      );
    });
  });

  describe('leaveRoom', () => {
    it('should allow user to leave a room', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'UPDATE',
        oid: 0,
        fields: [],
      });

      await expect(
        millionService.leaveRoom(userId, roomId),
      ).resolves.not.toThrow();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE million_room_participants'),
        expect.arrayContaining([userId, roomId]),
      );
    });
  });

  describe('startRound', () => {
    it('should allow host to start a round', async () => {
      const roomId = 'room-123';
      const hostId = 'host-123';

      // Mock get room
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: roomId,
            host_id: hostId,
            status: 'waiting',
            settings: { questionCount: 5, difficulty: 'mixed' },
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock create round
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'round-123',
            room_id: roomId,
            round_number: 1,
            started_at: new Date(),
            created_at: new Date(),
          },
        ],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      // Mock update room status
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'UPDATE',
        oid: 0,
        fields: [],
      });

      // Mock select questions (for selectQuestionsForRound)
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, difficulty: 1 },
          { id: 2, difficulty: 2 },
          { id: 3, difficulty: 3 },
        ],
        rowCount: 3,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock insert round questions
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 3,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      const round = await millionService.startRound(roomId, hostId);

      expect(round).toBeDefined();
      expect(round.room_id).toBe(roomId);
    });

    it('should throw error if non-host tries to start round', async () => {
      const roomId = 'room-123';
      const nonHostId = 'user-456';

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: roomId,
            host_id: 'host-123', // Different from nonHostId
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(
        millionService.startRound(roomId, nonHostId),
      ).rejects.toThrow('Only the host can start a round');
    });

    it('should throw error if room not found', async () => {
      const roomId = 'nonexistent-room';
      const hostId = 'host-123';

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(millionService.startRound(roomId, hostId)).rejects.toThrow(
        'Room not found',
      );
    });
  });

  describe('submitAnswer', () => {
    it('should accept correct answer and award points', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';
      const questionId = 1;
      const chosenIndex = 2;
      const timeTaken = 5;

      // Mock get active round
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'round-123',
            room_id: roomId,
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock check duplicate answer
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock get question
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: questionId,
            correct_index: 2,
            difficulty: 3,
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock check if first correct answer
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock get user streak
      mockQuery.mockResolvedValueOnce({
        rows: [{ count: 2 }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock insert answer
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      // Mock update score
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      const result = await millionService.submitAnswer(
        userId,
        roomId,
        questionId,
        chosenIndex,
        timeTaken,
      );

      expect(result).toBeDefined();
      expect(result.isCorrect).toBe(true);
      expect(result.pointsAwarded).toBeGreaterThan(0);
      expect(result.correctIndex).toBe(2);
    });

    it('should handle incorrect answer', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';
      const questionId = 1;
      const chosenIndex = 0; // Wrong answer
      const timeTaken = 5;

      // Mock get active round
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'round-123',
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock check duplicate
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock get question
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: questionId,
            correct_index: 2, // Correct is 2, user chose 0
            difficulty: 3,
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock insert answer
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      // Mock update score
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: [],
      });

      const result = await millionService.submitAnswer(
        userId,
        roomId,
        questionId,
        chosenIndex,
        timeTaken,
      );

      expect(result.isCorrect).toBe(false);
      expect(result.pointsAwarded).toBe(0);
    });

    it('should throw error on duplicate answer submission', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';
      const questionId = 1;

      // Mock get active round
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'round-123' }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock duplicate answer found
      mockQuery.mockResolvedValueOnce({
        rows: [{ user_id: userId }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(
        millionService.submitAnswer(userId, roomId, questionId, 0, 5),
      ).rejects.toThrow('Answer already submitted');
    });

    it('should throw error if no active round', async () => {
      const userId = 'user-123';
      const roomId = 'room-123';
      const questionId = 1;

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(
        millionService.submitAnswer(userId, roomId, questionId, 0, 5),
      ).rejects.toThrow('No active round');
    });
  });

  describe('getRoom', () => {
    it('should return room details', async () => {
      const roomId = 'room-123';

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: roomId,
            title: 'غرفة العلوم',
            host_id: 'host-123',
            status: 'waiting',
            type: 'public',
            created_at: new Date(),
          },
        ],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      // Mock participants
      mockQuery.mockResolvedValueOnce({
        rows: [
          { user_id: 'user-1', joined_at: new Date() },
          { user_id: 'user-2', joined_at: new Date() },
        ],
        rowCount: 2,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      const room = await millionService.getRoom(roomId);

      expect(room).toBeDefined();
      expect(room.id).toBe(roomId);
    });

    it('should throw error if room not found', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      await expect(millionService.getRoom('nonexistent')).rejects.toThrow(
        'Room not found',
      );
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard sorted by points', async () => {
      const roomId = 'room-123';

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            user_id: 'user-1',
            total_points: 500,
            correct_answers: 8,
            questions_answered: 10,
          },
          {
            user_id: 'user-2',
            total_points: 300,
            correct_answers: 6,
            questions_answered: 10,
          },
          {
            user_id: 'user-3',
            total_points: 200,
            correct_answers: 4,
            questions_answered: 10,
          },
        ],
        rowCount: 3,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      const leaderboard = await millionService.getLeaderboard(roomId);

      expect(leaderboard).toHaveLength(3);
      expect(leaderboard[0].totalPoints).toBe(500);
      expect(leaderboard[1].totalPoints).toBe(300);
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[1].rank).toBe(2);
    });
  });

  describe('getUserHistory', () => {
    it('should return user game history', async () => {
      const userId = 'user-123';
      const limit = 10;

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            room_id: 'room-1',
            title: 'Game 1',
            created_at: new Date(),
            total_points: 500,
          },
          {
            room_id: 'room-2',
            title: 'Game 2',
            created_at: new Date(),
            total_points: 300,
          },
        ],
        rowCount: 2,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      const history = await millionService.getUserHistory(userId, limit);

      expect(history).toHaveLength(2);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        expect.arrayContaining([userId, limit]),
      );
    });
  });

  describe('getRoundQuestions', () => {
    it('should return questions for a round', async () => {
      const roundId = 'round-123';

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            text_ar: 'سؤال 1',
            options: ['أ', 'ب', 'ج', 'د'],
            correct_index: 0,
          },
          {
            id: 2,
            text_ar: 'سؤال 2',
            options: ['أ', 'ب', 'ج', 'د'],
            correct_index: 1,
          },
        ],
        rowCount: 2,
        command: 'SELECT',
        oid: 0,
        fields: [],
      });

      const questions = await millionService.getRoundQuestions(roundId);

      expect(questions).toHaveLength(2);
      expect(questions[0].text_ar).toBe('سؤال 1');
    });
  });

  describe('finishRound', () => {
    it('should mark round as finished', async () => {
      const roundId = 'round-123';

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
        command: 'UPDATE',
        oid: 0,
        fields: [],
      });

      await expect(millionService.finishRound(roundId)).resolves.not.toThrow();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE million_rounds'),
        expect.arrayContaining([roundId]),
      );
    });
  });
});
