import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          'purple',
          'green',
          'black'
        ]
      }
    ],
    labels: [] as string[]
  };

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {}

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        if (res.myBudget) {
          this.dataSource.datasets[0].data = res.myBudget.map((item: any) => item.budget);
          this.dataSource.labels = res.myBudget.map((item: any) => item.title);
        }
        this.createChart();
        this.createD3Chart();
      });
  }
  
  createChart() {
    if (isPlatformBrowser(this.platformId)) {
      const ctx = <HTMLCanvasElement>document.getElementById('myChart');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: this.dataSource
        });
      }
    }
  }

  createD3Chart() {
    if (isPlatformBrowser(this.platformId)) {
      const svg = d3.select('#myD3Chart')
        .attr('width', 400)
        .attr('height', 400);

      const radius = Math.min(400, 400) / 2;
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const pie = d3.pie<number>();
      const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(0).outerRadius(radius);

      const g = svg.append('g')
        .attr('transform', 'translate(' + radius + ',' + radius + ')');

      const dataForPie = this.dataSource.datasets[0].data;
      const dataReady = pie(dataForPie);

      g.selectAll('arc')
        .data(dataReady)
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i.toString()));
    }
  }
}
