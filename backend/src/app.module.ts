import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // replace with your DB username
      password: 'Vikas@9084', // replace with your DB password
      database: 'escrawl',
      autoLoadEntities: true,
      synchronize: true, // auto-create tables in dev
    }),
    UserModule, // important — must be imported AFTER database config
  ],
})
export class AppModule {}
