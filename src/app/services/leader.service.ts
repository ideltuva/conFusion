import { Injectable } from '@angular/core';

import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable()
export class LeaderService {

  constructor() { }

  getLeader(id: number): Promise<Leader> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
    setTimeout(()=> Promise.resolve(LEADERS.filter((leader) => (leader.id === id))[0]), 2000);
    });
  }

  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
    setTimeout(()=> Promise.resolve(LEADERS.filter((leader) => leader.featured)[0]), 2000);
    });
  }

  getLeaders(): Promise<Leader[]> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
    setTimeout(()=> Promise.resolve(LEADERS), 2000);
    });
  }  

}
