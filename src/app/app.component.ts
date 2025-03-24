import { Component, OnDestroy, OnInit } from '@angular/core';
import { seasonClockService } from '../services/season-clock.service';
import { TimeObj } from './models/time-obj.model';

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

  async ngOnInit() {
    console.log('on init called');
    try {
      const seasonData: TimeObj = (await seasonClockService.query()) as TimeObj;
      if (seasonData) {
        this.timeObj = seasonData;
      }
    } catch (error) {
      console.error('error fetching data:', error);
    }
  }

  ngOnDestroy() {}

  onToggleTheme() {
    this.isDark = !this.isDark;
  }
}
