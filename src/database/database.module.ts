import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Job, JobSchema } from './schemas/job.schema';
import { JobsUtilService } from './services/jobs.util.service';
import { JobsValidateService } from './services/jobs.validate.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersUtilService } from './services/users.util.service';
import { UsersValidateService } from './services/users.validate.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
  ],
  providers: [
    UsersUtilService,
    JobsUtilService,
    // Validates
    UsersValidateService,
    JobsValidateService,
  ],
  exports: [
    MongooseModule,
    UsersUtilService,
    JobsUtilService,
    // Validates
    UsersValidateService,
    JobsValidateService,
  ],
})
export class DatabaseModule {}
