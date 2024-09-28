import { Test, TestingModule } from '@nestjs/testing';
import { ChoreService } from './chore.service';
import { ChoreRepository } from '../repo/chore.repository';
import { ChoreDto } from '../model/chore.dto';
import { Chore } from '../model/chore.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChorePlace } from '../model/chore-place.enum';

describe('ChoreService', () => {
  let service: ChoreService;
  let repository: ChoreRepository;

  const mockChoreRepository = {
    findAll: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoreService,
        {
          provide: ChoreRepository,
          useValue: mockChoreRepository,
        },
      ],
    }).compile();

    service = module.get<ChoreService>(ChoreService);
    repository = module.get<ChoreRepository>(ChoreRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all chores', async () => {
    const choreDtos: ChoreDto[] = [
      {
        id: '1-1-1-1-1',
        choreDescription: 'Test',
        completed: false,
        creationDate: undefined,
        expirationDate: undefined,
        chorePlace: ChorePlace.YARD,
        orderedBy: undefined,
        orderedFor: undefined,
      },
    ];
    mockChoreRepository.findAll.mockResolvedValue(choreDtos);

    const result = await service.getAllChores();
    expect(result).toEqual(choreDtos);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should return active chores', async () => {
    const activeChores: ChoreDto[] = [
      {
        id: '1-1-1-1-1',
        choreDescription: 'Test',
        completed: true,
        creationDate: undefined,
        expirationDate: undefined,
        chorePlace: ChorePlace.YARD,
        orderedBy: undefined,
        orderedFor: undefined,
      },
    ];
    mockChoreRepository.findActive.mockResolvedValue(activeChores);

    const result = await service.getActiveChores();
    expect(result).toEqual(activeChores);
    expect(repository.findActive).toHaveBeenCalled();
  });

  it('should complete a chore', async () => {
    const choreId = randomUUID();
    const chore: Chore = {
      id: choreId,
      choreDescription: 'Test Chore',
      completed: false,
      creationDate: new Date(),
      expirationDate: new Date(),
      chorePlace: ChorePlace.YARD,
      orderedBy: undefined,
      orderedFor: undefined,
    };
    mockChoreRepository.findById.mockResolvedValue(chore);
    mockChoreRepository.update.mockResolvedValue(true);

    const result = await service.completeChore(choreId);
    expect(result.completed).toBe(true);
    expect(repository.findById).toHaveBeenCalledWith(choreId);
    expect(repository.update).toHaveBeenCalledWith(chore);
  });

  it('should throw an error if chore is already completed', async () => {
    const choreId = randomUUID();
    const chore: Chore = {
      id: choreId,
      choreDescription: 'Test Chore',
      completed: true,
      creationDate: new Date(),
      expirationDate: new Date(),
      chorePlace: ChorePlace.YARD,
      orderedBy: undefined,
      orderedFor: undefined,
    };
    mockChoreRepository.findById.mockResolvedValue(chore);

    await expect(service.completeChore(choreId)).rejects.toThrowError(
      `Chore ${chore.choreDescription} is already completed.`,
    );
  });

  it('should create a new chore', async () => {
    const newChore: ChoreDto = {
      choreDescription: 'New Chore',
      completed: null,
      id: null,
      creationDate: null,
      expirationDate: null,
      chorePlace: ChorePlace.YARD,
      orderedBy: { name: 'QA', surname: null },
      orderedFor: { name: 'DEV', surname: null },
    };
    const savedChore: ChoreDto = {
      ...newChore,
      id: randomUUID(),
      creationDate: new Date(),
      expirationDate: new Date(),
      completed: false,
    };
    mockChoreRepository.save.mockResolvedValue(savedChore);

    const result = await service.createChore(newChore);
    expect(result.id).not.toBeNull();
    expect(result.completed).toBe(false);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        choreDescription: 'New Chore',
        completed: false,
      }),
    );
  });

  it('should delete a chore', async () => {
    const choreId = randomUUID();
    const chore: ChoreDto = {
      id: choreId,
      choreDescription: 'Test Chore',
      completed: false,
      creationDate: null,
      expirationDate: null,
      chorePlace: ChorePlace.YARD,
      orderedBy: null,
      orderedFor: null,
    };
    mockChoreRepository.findById.mockResolvedValue(chore);
    mockChoreRepository.delete.mockResolvedValue(true);

    const result = await service.deleteChoreById(choreId);
    expect(result).toEqual(chore);
    expect(repository.findById).toHaveBeenCalledWith(choreId);
    expect(repository.delete).toHaveBeenCalledWith(choreId);
  });

  it('should throw an error if chore to delete does not exist', async () => {
    const choreId = randomUUID();
    mockChoreRepository.findById.mockResolvedValue(null);

    await expect(service.deleteChoreById(choreId)).rejects.toThrow(
      new HttpException('Unable to delete chore.', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw an error if chore deletion fails', async () => {
    const choreId = randomUUID();
    const chore: ChoreDto = {
      id: choreId,
      choreDescription: 'Test Chore',
      completed: false,
      creationDate: undefined,
      expirationDate: undefined,
      chorePlace: ChorePlace.YARD,
      orderedBy: null,
      orderedFor: null,
    };
    mockChoreRepository.findById.mockResolvedValue(chore);
    mockChoreRepository.delete.mockResolvedValue(false);

    await expect(service.deleteChoreById(choreId)).rejects.toThrow(
      new HttpException(
        'Unable to delete chore.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
