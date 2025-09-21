import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';

// Mock environment variable
process.env.TELEGRAM_BOT_TOKEN = 'mock_token_for_testing';

describe('TelegramService', () => {
  let service: TelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramService],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a launch method', () => {
    expect(service.launch).toBeDefined();
    expect(typeof service.launch).toBe('function');
  });

  it('should have a stop method', () => {
    expect(service.stop).toBeDefined();
    expect(typeof service.stop).toBe('function');
  });
});