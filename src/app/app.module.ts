import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TodoModule } from '../todo/todo.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule, UsersModule, TodoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
