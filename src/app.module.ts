import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DataResolverModule } from './data-resolver/data-resolver.module';

const environment = process.env.NODE_ENV || 'development';

console.log(process.env.MONGODB_WRITE_CONNECTION_STRING)

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_WRITE_CONNECTION_STRING,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    ),
    DataResolverModule,
  ]
})
export class AppModule {}
