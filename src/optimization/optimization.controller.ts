import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { JobsUtilService } from '../database/services/jobs.util.service';
import { JobsValidateService } from '../database/services/jobs.validate.service';
import { ApiSecurity } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/decorators/auth.decorator';

@Controller()
export class OptimizationController {
  constructor(
    private httpService: HttpService,
    private jobsUtilService: JobsUtilService,
    private jobsValidateService: JobsValidateService,
    private config: ConfigService,
  ) {}

  @ApiSecurity('api-key')
  @Post('tsp-long')
  async googleDirection(@Body() body) {
    const jobId = uuidv4();
    await this.jobsUtilService.createNewJob({ jobId });

    let capacity = Object.keys(body.visits).length;
    if (capacity > 25) {
      return {
        message:
          'Too many visits in this request. Please limit your optimization request to 25 visits or less (https://developers.google.com/maps/documentation/directions/usage-and-billing).',
      };
    }
    capacity = Object.keys(body.fleet).length;
    if (capacity !== 1) {
      return {
        message:
          'Too many visits in this request. Please limit your optimization request to 25 visits or less (https://developers.google.com/maps/documentation/directions/usage-and-billing).',
      };
    }

    // Convert address to coordinates
    const points = [];
    const visits = body.visits;
    const fleets = body.fleet;
    const options = body.options;
    let driver = null;
    const stops = [];

    for (const key in visits) {
      const visit = visits[key];
      const address = visit.location?.address;

      if (!address) {
        return {
          message: `Your visit (${key}) is missing the address field.`,
        };
      }

      points.push(address);
      stops.push({ ...visit, key });
    }

    for (const key in fleets) {
      const fleet = fleets[key];
      const address = fleet.start_location?.address;

      if (!address) {
        return {
          message: `Your fleet (${key}) is missing the address field.`,
        };
      }

      driver = { ...fleet, key };
    }

    let url = `https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&waypoints=optimize:true|{waypoints}&key={key}`;
    url = url.replace('{origin}', driver.start_location?.address);
    stops.push({ location: driver.start_location, key: driver.key });

    if (driver.end_location) {
      url = url.replace('{destination}', driver.end_location?.address);
      stops.push({ location: driver.end_location, key: driver.key });
    } else {
      url = url.replace('{destination}', driver.start_location?.address);
      stops.push({ location: driver.start_location, key: driver.key });
    }

    const googleKey = this.config.get('GOOGLE_KEY');
    url = url.replace('{waypoints}', points.join('|'));
    url = url.replace('{key}', options.google_key ?? googleKey);
    url = encodeURI(url);

    const response = await this.httpService.get(url).toPromise();
    const { data } = response;

    if (data.status !== 'OK') {
      return data;
    }

    const output = {
      status: 'completed',
      fitness: 0,
      unserved: [],
      solution: {},
      polylines: {},
    };
    const route = data.routes[0];
    const { legs, overview_polyline, waypoint_order } = route;

    const hhmmToMinutes = (hhmm) => {
      const a = hhmm.split(':');
      return +a[0] * 60 + +a[1];
    };
    const minutesToHHmm = (m) => {
      const hours = Math.floor(m / 60);
      const minutes = m - hours * 60;
      return (
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0')
      );
    };

    let arrivalTime = hhmmToMinutes(
      driver.shift_start ? driver.shift_start : '08:00',
    );
    let finishTime = arrivalTime + 1;

    const steps = [];
    steps.push({
      location_id: driver.id ? driver.id : driver.key,
      location_name: driver.start_location.name,
      arrival_time: minutesToHHmm(arrivalTime),
      finish_time: minutesToHHmm(finishTime),
    });

    legs.forEach((leg, key) => {
      const { duration } = leg;
      const index =
        typeof waypoint_order[key] === 'undefined'
          ? stops.length - 1
          : waypoint_order[key];
      const visit = stops[index];
      arrivalTime = arrivalTime + Math.round(duration.value / 60);
      finishTime = arrivalTime + 1;

      steps.push({
        location_id: visit.key,
        location_name: visit.location.name,
        arrival_time: minutesToHHmm(arrivalTime),
        finish_time: minutesToHHmm(finishTime),
      });
    });

    output.solution[driver.key] = steps;
    output.polylines[driver.key] = overview_polyline.points;

    await this.jobsUtilService.updateJobByJobId(jobId, {
      input: JSON.stringify(body),
      output: JSON.stringify(output),
    });

    return { job_id: jobId };
  }

  @Public()
  @Get('jobs/:id')
  async getJob(@Param('id') id: string) {
    const job = await this.jobsValidateService.validateJobByJobId(id);

    return {
      id: job.jobId,
      status: 'finished',
      output: JSON.parse(job.output),
    };
  }
}
