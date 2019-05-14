import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import{SystemConstants} from '../../core/common/system.constants';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { LoggedInUser } from '../domain/loggedin.user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(private _http:HttpClient) { }
  login(username:string, password:string){
    let body="userName="+encodeURIComponent(username)+
    "&password="+encodeURIComponent(password)+
    "&grant_type=password";
    let headers= new HttpHeaders().set('Authorization', 'Bearer ' + 
    localStorage.getItem('access_token'));;
    headers.append("Content-Type","application/x-www-form-urlencoded");
    let options= {headers:headers}
    return this._http.post<any>(SystemConstants.BASE_API+'/api/oauth/token',body,options).pipe(map(user=> {

        if(user && user.access_token){
          localStorage.removeItem(SystemConstants.CURRENT_USER);
          localStorage.setItem(SystemConstants.CURRENT_USER,JSON.stringify(user));
          
        }
        return user;
      }))
  }
  logout(){
      localStorage.removeItem(SystemConstants.CURRENT_USER);
  }
  isUserAuthenticated():boolean{
    let user= localStorage.getItem(SystemConstants.CURRENT_USER);
    if(user!=null){return true;}
    else{
      return false;
    }
  }
  getLoggedInUser():LoggedInUser{
    let user:LoggedInUser;
    if(this.isUserAuthenticated()){
      var userData= JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER))
      user= new LoggedInUser(userData.access_token,userData.username,userData.fullName, userData.Email,userData.avatar,userData.roles, userData.permissions, userData.POS);
      //console.log(user);
    }
    else{
      user=null;
    }
    return user;
  }
  checkAccess(functionId: string) {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var permission: any[] = JSON.parse(user.permissions);
    console.log(user.permissions);
    var roles: any[] = JSON.parse(user.roles);
    var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanRead == true);
    if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1) {
      return true;
    }
    else
      return false;
  }
  hasPermission(functionId: string, action: string): boolean {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var permission: any[] =  JSON.parse(user.permissions);
    var roles: any[] = JSON.parse(user.roles);
    switch (action) {
      case 'create':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanCreate == true);
        if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
          result = true;
        break;
      case 'update':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanUpdate == true);
        if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
          result = true;
        break;
      case 'delete':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanDelete == true);
        if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
          result = true;
        break;
    }
    return result;
  }
}
