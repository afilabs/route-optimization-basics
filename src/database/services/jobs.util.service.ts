import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from '../schemas/job.schema';

@Injectable()
export class JobsUtilService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async createNewJob(fields = {}): Promise<Job> {
    const job = new this.jobModel(fields);
    await job.save();
    return job;
  }

  async updateJobByJobId(jobId: string, fields: any) {
    return this.jobModel.updateOne(
      { jobId: jobId },
      {
        ...fields,
        updatedAt: new Date(),
      },
    );
  }
}
