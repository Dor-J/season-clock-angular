import { Component, OnDestroy, OnInit } from '@angular/core';
import { seasonClockService } from '../services/season-clock.service';
import { TimeObj } from './models/time-obj.model';
import { Clock } from './models/clock.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'season-clock-angular';
  isDark: boolean = false;

  timeObj: TimeObj = {
    season: 'Winter',
    month: 'January',
    dayOfWeek: 'Thursday',
  };

  intervalId: ReturnType<typeof setInterval> | null = null;

  async ngOnInit() {
    try {
      const seasonData: TimeObj = (await seasonClockService.query()) as TimeObj;
      if (seasonData) {
        this.timeObj = seasonData;
      }
    } catch (error) {
      console.error('error fetching data:', error);
    }

    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  clock: Clock = {
    hour: 0,
    minute: 0,
    second: 0,
  };
  second: number = 0;
  updateTime(): void {
    let currSecond: number = (this.clock.second += 1);
    let prevTime: Clock = this.clock;
    if (prevTime.minute >= 60) {
      prevTime.hour += 1;
      prevTime.minute = 0;
    }
    if (currSecond >= 60) {
      prevTime.minute += 1;
      prevTime.second = 0;
    } else {
      prevTime.second = currSecond;
    }

    this.clock = { ...this.clock, ...prevTime };
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onToggleTheme() {
    this.isDark = !this.isDark;
  }
}
