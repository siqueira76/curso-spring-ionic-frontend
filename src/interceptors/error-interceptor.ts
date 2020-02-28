import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../service/storage.service';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Passou no interceptor");
        return next.handle(req)
        .catch((error, caught) => {

            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            switch(errorObj.status) {

                case 401:
                    this.handle401();
                    break;

                case 403:
                    this.handle403();
                    break;

                default:
                    this.handlerDefaultError(errorObj);
            }

            return Observable.throw(errorObj);
        }) as any;
    }
    handlerDefaultError(errorObj: any) {

        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ' : ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'ok'
                }
            ]
        });
        alert.present();
        
    }

    handle401() {

        let alert = this.alertCtrl.create({
            title: 'Erro 401, Falha de Autenticação',
            message: 'Email ou senha Incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'ok'
                }
            ]
        });
        alert.present();
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};