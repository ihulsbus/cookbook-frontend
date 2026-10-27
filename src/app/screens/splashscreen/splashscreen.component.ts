import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SplashscreenContentComponent } from '../../components/splashscreen-content/splashscreen-content.component';
import { CommonModule } from '@angular/common';

interface SplashFiles {
  filename: string
  copyright: string
}

@Component({
    selector: 'app-splashscreen',
    standalone: true,
    templateUrl: './splashscreen.component.html',
    styleUrls: ['./splashscreen.component.css'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        SplashscreenContentComponent,
    ]
})
export class SplashscreenComponent {

  cdn: string = environment.cdn

  images: Array<SplashFiles> = [
    { filename: '1.jpg', copyright: 'Background by <a href="https://unsplash.com/@toddquackenbush?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Todd Quackenbush</a> on <a href="https://unsplash.com">Unsplash</a>'},
    { filename: '2.jpg', copyright: 'Background by <a href="https://unsplash.com/@jaywennington?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jay Wennington</a> on <a href="https://unsplash.com">Unsplash</a>' },
    { filename: '3.jpg', copyright: 'Background by <a href="https://unsplash.com/@mvdheuvel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maarten van den Heuvel</a> on <a href="https://unsplash.com">Unsplash</a>' },
    { filename: '4.jpg', copyright: 'Background by <a href="https://unsplash.com/@pratiksha_mohanty?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Pratiksha Mohanty</a> on <a href="https://unsplash.com">Unsplash</a>' },
    { filename: '5.jpg', copyright: 'Background by <a href="https://unsplash.com/@videmusart?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Syd Wachs</a> on <a href="https://unsplash.com">Unsplash</a>' },
    { filename: '6.jpg', copyright: 'Background by <a href="https://unsplash.com/@webvilla?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Webvilla</a> on <a href="https://unsplash.com">Unsplash</a>' },
  ];
  imageNR: number = Math.floor(Math.random() * this.images.length);
  background: Object = { 'background-image': `url(${this.cdn}/splash/${this.images[this.imageNR].filename})`};
  Copyright?: string;

  constructor() { }

  ngOnInit() {}

}
