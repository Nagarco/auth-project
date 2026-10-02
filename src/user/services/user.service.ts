import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.createUserObject(createUserDto);
    const user = this.userRepository.create(newUser);
    return this.userRepository.save(user);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async delete(id: number) {
    const result = await this.userRepository.delete(id);
    if (!result.affected)
      throw new NotFoundException(`User with id ${id} not found`);
  }

  async update(id: number, dto: UpdateUserDto) {
    const result = await this.userRepository.update(id, { ...dto });
    if (!result.affected) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
  async createUserObject(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    return {
      ...createUserDto,
      password: hashedPassword,
    };
  }
}
