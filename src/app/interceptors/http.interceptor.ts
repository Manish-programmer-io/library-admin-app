import {  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()

export class HttpRequestInterceptor implements HttpInterceptor{
  constructor(private loaderService: LoaderService){}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>{
    this.loaderService.show();

    return next.handle(request).pipe(
      finalize(() => this.loaderService.hide()) //Hide the loader after the request completed.
    );
  }
  
}
