import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../schemas/job.schema';

@Injectable()
export class JobsValidateService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async validateJobByJobId(jobId: string) {
    const job = await this.jobModel.findOne({ jobId: jobId }).exec();
    if (!job) {
      throw new BadRequestException([`job not exist`]);
    }
    return job;
  }
}
