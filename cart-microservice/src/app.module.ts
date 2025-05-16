import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    CartModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB Bağlantısı Kuruldu');
          });

          connection.on('disconnected', () => {
            console.warn('MongoDB Bağlantısı Kesildi');
          });

          connection.on('error', (error) => {
            console.error('MongoDB Bağlantı Hatası:', error);
          });

          connection.on('reconnected', () => {
            console.log('MongoDB Bağlantısı Yeniden Kuruldu');
          });

          connection.on('reconnectFailed', () => {
            console.error('MongoDB Bağlantısı Yeniden Kurulamadı');
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
