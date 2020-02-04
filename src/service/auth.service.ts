import { HttpClient } from "@angular/common/http";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../config/api.config";
import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from "angular2-jwt";


@Injectable()
export class Authservice {

    jwtHelper : JwtHelper = new JwtHelper();

    constructor(public http: HttpClient, public storage : StorageService) {
    }

    authenticate(credis: CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            credis,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    successfulLogin(autorizationValue : string) {
        let tok = autorizationValue.substring(7);
        let user : LocalUser = {
            token : tok,
            email : this.jwtHelper.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);
    }

    logOut() {
        this.storage.setLocalUser(null);
    }

}