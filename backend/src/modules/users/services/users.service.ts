import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async getAllUsers() {
    return this.usersRepository.findAll();
  }

  async createUser(data: any) {
    return this.usersRepository.create(data);
  }
}
