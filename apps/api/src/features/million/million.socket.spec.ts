import { io, Socket } from 'socket.io-client';
import { generateToken } from '../../middleware/auth.middleware';
import setupMillionSocket from './million.socket';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';

describe('Million WebSocket', () => {
  let ioServer: SocketIOServer;
  let clientSocket: Socket;
  let authToken: string;
  let userId: string;
  const serverPort = 3002; // Use different port for testing

  beforeAll((done) => {
    // Create HTTP server
    const httpServer = createServer();

    // Initialize Socket.IO server
    ioServer = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        credentials: true,
      },
    });

    // Setup Million WebSocket
    setupMillionSocket(ioServer);

    // Start server
    httpServer.listen(serverPort, () => {
      done();
    });

    // Generate test token
    userId = '123e4567-e89b-12d3-a456-426614174000';
    authToken = generateToken({
      id: userId,
      email: 'test@example.com',
      role: 'student',
      name: 'Test User',
    });
  });

  afterAll(() => {
    ioServer.close();
  });

  beforeEach((done) => {
    // Create client socket before each test
    clientSocket = io(`http://localhost:${serverPort}/million`, {
      auth: {
        token: authToken,
      },
      transports: ['websocket'],
    });

    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  describe('Authentication', () => {
    it('should connect with valid token', (done) => {
      const socket = io(`http://localhost:${serverPort}/million`, {
        auth: {
          token: authToken,
        },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        expect(socket.connected).toBe(true);
        socket.disconnect();
        done();
      });

      socket.on('connect_error', (error) => {
        fail(`Should not error: ${error.message}`);
      });
    });

    it('should reject connection without token', (done) => {
      const socket = io(`http://localhost:${serverPort}/million`, {
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        fail('Should not connect without token');
      });

      socket.on('connect_error', (error) => {
        expect(error.message).toContain('Authentication required');
        socket.disconnect();
        done();
      });
    });

    it('should reject connection with invalid token', (done) => {
      const socket = io(`http://localhost:${serverPort}/million`, {
        auth: {
          token: 'invalid-token-123',
        },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        fail('Should not connect with invalid token');
      });

      socket.on('connect_error', (error) => {
        expect(error.message).toContain('Invalid token');
        socket.disconnect();
        done();
      });
    });
  });

  describe('create-room Event', () => {
    it('should create a room via WebSocket', (done) => {
      const roomData = {
        title: 'غرفة اختبار',
        type: 'public',
        settings: {
          questionCount: 5,
          timeLimit: 15,
        },
      };

      clientSocket.emit('create-room', roomData, (response: any) => {
        expect(response.success).toBe(true);
        expect(response.room).toBeDefined();
        expect(response.room.title).toBe(roomData.title);
        expect(response.room.type).toBe(roomData.type);
        done();
      });
    });

    it('should broadcast room.created event', (done) => {
      const roomData = {
        title: 'غرفة البث',
        type: 'public',
      };

      clientSocket.on('room.created', (data: any) => {
        expect(data.roomId).toBeDefined();
        expect(data.room).toBeDefined();
        done();
      });

      clientSocket.emit('create-room', roomData, () => {
        // Callback handled, waiting for broadcast
      });
    });

    it('should return error with invalid data', (done) => {
      clientSocket.emit('create-room', {}, (response: any) => {
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
        done();
      });
    });
  });

  describe('join-room Event', () => {
    let roomId: string;

    beforeEach((done) => {
      // Create a room first
      clientSocket.emit(
        'create-room',
        { title: 'Test Room', type: 'public' },
        (response: any) => {
          roomId = response.room.id;
          done();
        },
      );
    });

    it('should join an existing room', (done) => {
      // Create a second client
      const client2 = io(`http://localhost:${serverPort}/million`, {
        auth: {
          token: generateToken({
            id: 'user-456',
            email: 'user2@example.com',
            role: 'student',
            name: 'User 2',
          }),
        },
        transports: ['websocket'],
      });

      client2.on('connect', () => {
        client2.emit('join-room', { roomId }, (response: any) => {
          expect(response.success).toBe(true);
          expect(response.room).toBeDefined();
          client2.disconnect();
          done();
        });
      });
    });

    it('should broadcast room.joined event to all participants', (done) => {
      clientSocket.on('room.joined', (data: any) => {
        expect(data.roomId).toBe(roomId);
        expect(data.player).toBeDefined();
        expect(data.participantCount).toBeGreaterThan(0);
        done();
      });

      // Join with the same client (should trigger broadcast)
      clientSocket.emit('join-room', { roomId }, () => {});
    });

    it('should return error for non-existent room', (done) => {
      clientSocket.emit(
        'join-room',
        { roomId: '00000000-0000-0000-0000-000000000000' },
        (response: any) => {
          expect(response.success).toBe(false);
          expect(response.error).toContain('not found');
          done();
        },
      );
    });
  });

  describe('leave-room Event', () => {
    let roomId: string;

    beforeEach((done) => {
      clientSocket.emit(
        'create-room',
        { title: 'Test Room', type: 'public' },
        (response: any) => {
          roomId = response.room.id;
          done();
        },
      );
    });

    it('should leave a room', (done) => {
      clientSocket.emit('leave-room', { roomId }, (response: any) => {
        expect(response.success).toBe(true);
        done();
      });
    });

    it('should broadcast room.left event', (done) => {
      // Create second client to listen for broadcast
      const client2 = io(`http://localhost:${serverPort}/million`, {
        auth: { token: authToken },
        transports: ['websocket'],
      });

      client2.on('connect', () => {
        client2.emit('join-room', { roomId }, () => {
          // Listen for leave event
          client2.on('room.left', (data: any) => {
            expect(data.roomId).toBe(roomId);
            expect(data.playerId).toBeDefined();
            client2.disconnect();
            done();
          });

          // Now leave with first client
          clientSocket.emit('leave-room', { roomId }, () => {});
        });
      });
    });
  });

  describe('start-round Event', () => {
    let roomId: string;

    beforeEach((done) => {
      clientSocket.emit(
        'create-room',
        { title: 'Test Room', type: 'public', settings: { questionCount: 3 } },
        (response: any) => {
          roomId = response.room.id;
          done();
        },
      );
    });

    it('should start a round as host', (done) => {
      clientSocket.emit('start-round', { roomId }, (response: any) => {
        expect(response.success).toBe(true);
        expect(response.round).toBeDefined();
        expect(response.round.room_id).toBe(roomId);
        done();
      });
    });

    it('should broadcast round.started event', (done) => {
      clientSocket.on('round.started', (data: any) => {
        expect(data.roomId).toBe(roomId);
        expect(data.roundId).toBeDefined();
        expect(data.questionCount).toBeGreaterThan(0);
        done();
      });

      clientSocket.emit('start-round', { roomId }, () => {});
    });

    it('should send questions sequentially', (done) => {
      let questionCount = 0;

      clientSocket.on('question.sent', (data: any) => {
        questionCount++;
        expect(data.question).toBeDefined();
        expect(data.question.text_ar).toBeDefined();
        expect(data.question.options).toBeDefined();
        expect(data.question.correct_index).toBeUndefined(); // Should not be sent
        expect(data.timeLimit).toBeDefined();

        if (questionCount >= 3) {
          done();
        }
      });

      clientSocket.emit('start-round', { roomId }, () => {});
    }, 15000); // Increase timeout for sequential questions

    it('should reject if non-host tries to start', (done) => {
      // Create a second client (different user)
      const client2 = io(`http://localhost:${serverPort}/million`, {
        auth: {
          token: generateToken({
            id: 'user-789',
            email: 'user3@example.com',
            role: 'student',
            name: 'User 3',
          }),
        },
        transports: ['websocket'],
      });

      client2.on('connect', () => {
        client2.emit('start-round', { roomId }, (response: any) => {
          expect(response.success).toBe(false);
          expect(response.error).toContain('host');
          client2.disconnect();
          done();
        });
      });
    });
  });

  describe('submit-answer Event', () => {
    let roomId: string;
    let questionId: number;

    beforeEach((done) => {
      clientSocket.emit(
        'create-room',
        { title: 'Test Room', type: 'public', settings: { questionCount: 1 } },
        (response: any) => {
          roomId = response.room.id;

          clientSocket.on('question.sent', (data: any) => {
            questionId = data.question.id;
            done();
          });

          clientSocket.emit('start-round', { roomId }, () => {});
        },
      );
    }, 10000);

    it('should submit an answer', (done) => {
      clientSocket.emit(
        'submit-answer',
        {
          roomId,
          questionId,
          chosenIndex: 0,
          timeTaken: 5,
        },
        (response: any) => {
          expect(response.success).toBe(true);
          done();
        },
      );
    });

    it('should broadcast answer.received event', (done) => {
      clientSocket.on('answer.received', (data: any) => {
        expect(data.acknowledged).toBe(true);
        done();
      });

      clientSocket.emit(
        'submit-answer',
        {
          roomId,
          questionId,
          chosenIndex: 0,
          timeTaken: 5,
        },
        () => {},
      );
    });

    it('should broadcast question.result with correct index', (done) => {
      clientSocket.on('question.result', (data: any) => {
        expect(data.questionId).toBe(questionId);
        expect(data.correctIndex).toBeDefined();
        expect(data.scores).toBeDefined();
        expect(Array.isArray(data.scores)).toBe(true);
        done();
      });

      clientSocket.emit(
        'submit-answer',
        {
          roomId,
          questionId,
          chosenIndex: 0,
          timeTaken: 5,
        },
        () => {},
      );
    });

    it('should broadcast leaderboard.updated event', (done) => {
      clientSocket.on('leaderboard.updated', (data: any) => {
        expect(data.roomId).toBe(roomId);
        expect(data.leaderboard).toBeDefined();
        expect(Array.isArray(data.leaderboard)).toBe(true);
        done();
      });

      clientSocket.emit(
        'submit-answer',
        {
          roomId,
          questionId,
          chosenIndex: 0,
          timeTaken: 5,
        },
        () => {},
      );
    });
  });

  describe('round.finished Event', () => {
    it('should broadcast round.finished after all questions', (done) => {
      let roomId: string;

      clientSocket.on('round.finished', (data: any) => {
        expect(data.roomId).toBe(roomId);
        expect(data.roundId).toBeDefined();
        expect(data.finalLeaderboard).toBeDefined();
        expect(data.winner).toBeDefined();
        done();
      });

      // Create room and start round with 1 question
      clientSocket.emit(
        'create-room',
        { title: 'Quick Game', type: 'public', settings: { questionCount: 1 } },
        (response: any) => {
          roomId = response.room.id;
          clientSocket.emit('start-round', { roomId }, () => {});
        },
      );
    }, 25000); // Long timeout to wait for round to finish
  });

  describe('Disconnect', () => {
    it('should handle disconnect gracefully', (done) => {
      clientSocket.on('disconnect', () => {
        expect(clientSocket.connected).toBe(false);
        done();
      });

      clientSocket.disconnect();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in event callbacks', (done) => {
      clientSocket.emit('create-room', { invalid: 'data' }, (response: any) => {
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
        done();
      });
    });
  });
});
