import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ClassResponse } from '../models/class-response';
import { ClassData } from '../models/class-data';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private http: HttpClient) { }

  /**
   * Method gets data about classes
   * @param type - Type of classes(all, active, inActive)
   * @returns - Array with classes data
   */
  public getClasses(type: string): Observable<ClassData[]> {
    return this.http.get('/classes')
      .pipe(
        map((result: ClassResponse) => {
          switch (type) {
            case 'all': {
              return result.data;
            }
            case 'active': {
              return result.data.filter(currClass => currClass.isActive);
            }
            case 'inActive': {
              return result.data.filter(currClass => !currClass.isActive);
            }
          }
        })
      );
  }
}
