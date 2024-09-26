import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoService } from './todo.service';
import { Todo as TodoModel } from '@prisma/client';
import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';

class CreateTodoDto {
  @IsString()
  @Length(1, 500)
  content: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @Length(1, 500)
  content?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(
    @Request() req,
    @Body(new ValidationPipe()) todoData: CreateTodoDto,
  ): Promise<TodoModel> {
    const { userId } = req.user;
    return this.todoService.createTodo(userId, todoData);
  }

  @Get()
  async getAllTodos(
    @Request() req,
    @Query('completed') completed?: string,
  ): Promise<TodoModel[]> {
    const { userId } = req.user;
    const isCompleted =
      completed === 'true' ? true : completed === 'false' ? false : undefined;
    return this.todoService.todosForUser(userId, isCompleted);
  }

  @Get(':id')
  async getTodo(@Request() req, @Param('id') id: string): Promise<TodoModel> {
    const { userId } = req.user;
    return this.todoService.getTodo(userId, Number(id));
  }

  @Put(':id')
  async updateTodo(
    @Request() req,
    @Param('id') id: string,
    @Body(new ValidationPipe()) todoData: UpdateTodoDto,
  ): Promise<TodoModel> {
    const { userId } = req.user;
    return this.todoService.updateTodo(userId, Number(id), todoData);
  }

  @Delete(':id')
  async deleteTodo(
    @Request() req,
    @Param('id') id: string,
  ): Promise<TodoModel> {
    const { userId } = req.user;
    return this.todoService.deleteTodo(userId, Number(id));
  }
}
