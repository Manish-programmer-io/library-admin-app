import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-loader',
  standalone: false,
  
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  
  constructor(private loaderService: LoaderService) {
  }

  get isLoading$(): Observable<boolean> {
    return this.loaderService.isLoading$;}

}
