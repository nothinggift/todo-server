import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Todo, Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getTodo(userId: number, id: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    if (todo.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this todo',
      );
    }
    return todo;
  }

  async todosForUser(userId: number, completed?: boolean): Promise<Todo[]> {
    const where: Prisma.TodoWhereInput = { userId };
    if (completed !== undefined) {
      where.completed = completed;
    }
    return this.prisma.todo.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createTodo(userId: number, data: { content: string }): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        content: data.content,
        user: { connect: { id: userId } },
      },
    });
  }

  async updateTodo(
    userId: number,
    id: number,
    data: Prisma.TodoUpdateInput,
  ): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this todo',
      );
    }

    return this.prisma.todo.update({
      data,
      where: { id },
    });
  }

  async deleteTodo(userId: number, id: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this todo',
      );
    }

    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
