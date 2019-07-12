import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { UserAuthService } from './userAuth';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    idleTime: number = 0;
    interval;
    requestCount: number=0

    constructor(private userAuthService: UserAuthService, private spinner: NgxSpinnerService) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.idleTime = 0;

        if (!this.interval) {
            this.interval = setInterval(() => {
                this.idleTime = this.idleTime + 1;
                if (this.idleTime == 15) { // 15 min idle time
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userContext');
                    this.userAuthService.logoutClicked();
                }
            }, 60000) //60000 one min
        }

        this.requestCount = this.requestCount + 1;
        this.onRequestStart();
        

        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.requestCount = this.requestCount - 1;
                this.onResponseComplete();
            }  
        },
            (err: any) => {
                this.spinner.hide();
                if (err != undefined && err instanceof HttpErrorResponse &&  err.status == 401) {
                window.location.reload();
            }
            });        

    }

    onResponseComplete(): void {
        if (this.requestCount == 0)
            this.spinner.hide();
    }
    onRequestStart(): void {
        if (this.requestCount > 0)
            this.spinner.show();
    }
}
