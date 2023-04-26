import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Music, MusicSchema } from '../../schema/music.schema';
import { Playlist, PlaylistSchema } from '../../schema/playlist.schema';
import { User, UserSchema } from '../../schema/users.schema';
import { RemoveMusicFromPlaylistResponseDto } from '../dto/musics-in-playlist-response.dto';
import { PlaylistsSplitService } from './playlists.split.service';
import { createMusic } from './stubs/musics.stub';
import { createPlaylist } from './stubs/playlists.stub';
import { createUser } from './stubs/users.stub';

describe('playlistsSplitSercice', () => {
  let playlistsSplitService: PlaylistsSplitService;
  let userModel: Model<User>;
  let musicModel: Model<Music>;
  let playlistModel: Model<Playlist>;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    playlistModel = mongoConnection.model(Playlist.name, PlaylistSchema);
    musicModel = mongoConnection.model(Music.name, MusicSchema);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsSplitService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: getModelToken(Playlist.name),
          useValue: playlistModel,
        },
        {
          provide: getModelToken(Music.name),
          useValue: musicModel,
        },
      ],
    }).compile();
    userModel = module.get<Model<User>>(getModelToken(User.name));
    playlistModel = module.get<Model<Playlist>>(getModelToken(Playlist.name));
    musicModel = module.get<Model<Music>>(getModelToken(Music.name));
    playlistsSplitService = module.get<PlaylistsSplitService>(
      PlaylistsSplitService,
    );
  });

  it('should be defined', () => {
    expect(playlistsSplitService).toBeDefined();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  describe('removeMusicFromPlaylist()', () => {
    const mockUser = createUser();
    const mockAlbumId = new Types.ObjectId();
    const mockMusic1 = createMusic({ albumId: mockAlbumId });
    const mockMusic2 = createMusic({ albumId: mockAlbumId });
    const mockMusic3 = createMusic({ albumId: mockAlbumId });
    const mockAlbum = createPlaylist({
      _id: mockAlbumId,
      musics: [mockMusic1._id, mockMusic2._id, mockMusic3._id],
      userId: mockUser._id,
      isAlbum: true,
    });
    const mockPlaylist = createPlaylist({
      userId: mockUser._id,
      musics: [mockMusic1._id, mockMusic2._id, mockMusic3._id],
    });

    beforeEach(async () => {
      await userModel.create(mockUser);
      await playlistModel.create(mockAlbum);
      await musicModel.create(mockMusic1);
      await musicModel.create(mockMusic2);
      await musicModel.create(mockMusic3);
      await playlistModel.create(mockPlaylist);
    });

    it('should get NotFoundError when playlist not found', async () => {
      let mockWrongPlaylistId = new Types.ObjectId();
      while (mockWrongPlaylistId.equals(mockAlbumId)) {
        mockWrongPlaylistId = new Types.ObjectId();
      }
      await expect(
        playlistsSplitService.removeMusicFromPlaylist(
          mockUser._id,
          mockWrongPlaylistId,
          [mockMusic1._id],
        ),
      ).rejects.toThrowError(
        new NotFoundException(
          `There isn't any playlist with id: ${mockWrongPlaylistId}`,
        ),
      );
    });

    it('should get ForbiddenError when user is not owner of playlist', async () => {
      let mockWrongUserId = new Types.ObjectId();
      while (mockWrongUserId.equals(mockUser._id)) {
        mockWrongUserId = new Types.ObjectId();
      }
      await expect(
        playlistsSplitService.removeMusicFromPlaylist(
          mockWrongUserId,
          mockAlbumId,
          [mockMusic1._id],
        ),
      ).rejects.toThrowError(
        new ForbiddenException(
          `You don't have permission to remove music from this playlist`,
        ),
      );
    });

    it('should get ForbiddenError when user tries to remove music from its own album', async () => {
      await expect(
        playlistsSplitService.removeMusicFromPlaylist(
          mockUser._id,
          mockAlbumId,
          [mockMusic1._id],
        ),
      ).rejects.toThrowError(
        new ForbiddenException(`You can't remove music from this album`),
      );
    });

    it('should remove a music from playlist', async () => {
      const actual = playlistsSplitService.removeMusicFromPlaylist(
        mockUser._id,
        mockPlaylist._id,
        [mockMusic1._id],
      );
      const expected: RemoveMusicFromPlaylistResponseDto = {
        name: mockAlbum.name,
        description: mockAlbum.description,
        coverImage: mockAlbum.coverImage,
        musics: [mockMusic2._id.toString(), mockMusic3._id.toString()],
      };

      await expect(actual).resolves.toEqual(expected);
    });

    it('should remove multiple musics from playlist', async () => {
      const actual = playlistsSplitService.removeMusicFromPlaylist(
        mockUser._id,
        mockPlaylist._id,
        [mockMusic1._id, mockMusic2._id],
      );
      const expected: RemoveMusicFromPlaylistResponseDto = {
        name: mockAlbum.name,
        description: mockAlbum.description,
        coverImage: mockAlbum.coverImage,
        musics: [mockMusic3._id.toString()],
      };

      await expect(actual).resolves.toEqual(expected);
    });
  });
});
