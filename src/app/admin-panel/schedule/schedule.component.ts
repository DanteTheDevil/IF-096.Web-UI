import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ScheduleData } from '../../models/schedule-data';
import { ClassData } from '../../models/class-data';
import { SubjectData } from '../../models/subject-data';
import { ClassService } from '../../services/class.service';
import { SubjectService } from '../../services/subject.service';
import { ScheduleService } from '../../services/schedule.service';
import { LessonData } from '../../models/lesson-data';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  scheduleData: ScheduleData;

  frmSchedule: FormGroup;
  arrClassList: Array<ClassData>;
  arrSubjectsList: Array<SubjectData>;
  selectClassMsg = 'Виберіть клас*';
  dateTermStartMsg = 'Дата початку семестру*';
  dateTermEndMsg = 'Дата закінчення семестру*';

  weekDayName = [
    {legendDay: 'Понеділок', dailySubjects: 'mondaySubjects'},
    {legendDay: 'Вівторок', dailySubjects: 'tuesdaySubjects'},
    {legendDay: 'Середа', dailySubjects: 'wednesdaySubjects'},
    {legendDay: 'Четвер', dailySubjects: 'thursdaySubjects'},
    {legendDay: 'П`ятниця', dailySubjects: 'fridaySubjects'},
    {legendDay: 'Субота', dailySubjects: 'saturdaySubjects'}
  ];
  emittedDays = {
    mondaySubjects: null,
    tuesdaySubjects: null,
    wednesdaySubjects: null,
    thursdaySubjects: null,
    fridaySubjects: null,
    saturdaySubjects: null
  };

  constructor(
    private frmBld: FormBuilder,
    private classService: ClassService,
    private subjectsService: SubjectService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    this.classService.getClasses('active').subscribe(data => {
      this.arrClassList = data;
    });
    this.subjectsService.getSubjects().subscribe(data => {
      this.arrSubjectsList = data;
    });
    this.initForm();
  }

  /** Method initializes the initial state of the form */
  initForm() {
    this.frmSchedule = this.frmBld.group({
      dateTermStart: [''],
      dateTermEnd: [''],
      selectClass: ['', Validators.required]
    });
  }

  /**
   * Method gets schedule for selected class
   * @param classId - Id of selected class
   * @returns - Schedule for selected class
   */
  selectedClass(classId: number) {

    this.scheduleService.getSchedule(classId).subscribe(data => {
      this.scheduleData = data;
      //console.log(this.scheduleData);
    });
  }

  onAddDailySubjects($event: FormArray, daySubjects: string): void {
    this.emittedDays[daySubjects] = $event;
  }

  /**
   * The method checks the data in the control for validity
   * @param cntrName - Control's name
   * @returns true if control got focus and data in the control is not valid
   */
  isInputInvalid(cntrName: string): boolean {
    const control = this.frmSchedule.controls[cntrName];
    const result = control.invalid && control.touched;
    return result;
  }

  /**
   * The method checks the form for validity and then handle form data and generates data for creating a week schedule
   */
  onSubmit() {
    const controls = this.frmSchedule.controls;
    /* Check the form for validity */
    if (this.frmSchedule.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched() );
      window.scrollTo(0, 0);
      return;
    }
    /* Handling form data */

    this.scheduleData.startOfSemester = this.frmSchedule.controls['dateTermStart'].value;
    this.scheduleData.endOfSemester = this.frmSchedule.controls['dateTermEnd'].value;
    this.scheduleData.classId = this.frmSchedule.controls['selectClass'].value.id;
    this.scheduleData.className = this.frmSchedule.controls['selectClass'].value;

    Object.keys(this.emittedDays).forEach(dailySubjects => {
      this.scheduleData[dailySubjects] = this.addDailyData(dailySubjects);
    })
    console.log(this.scheduleData);
  }

  /**
   * The method generates data for the daily schedule
   * @param dailySubjects - Daily schedule's name
   * @returns - Data for the daily schedule
   */
  addDailyData(dailySubjects: string): LessonData[] {
    const dailyLesson: LessonData[] = [];
    for (let i = 0; i < (this.emittedDays[dailySubjects].value.length - 1); i++) {
      const lessonFirstGroup = {
        lessonNumber: '',
        subjectId: 0,
        subjectName: '',
        subjectDescription: ''
      }
      Object.keys(lessonFirstGroup).forEach(keyName =>
        lessonFirstGroup[keyName] = this.emittedDays[dailySubjects].value[i].firstGroup[keyName]);
        lessonFirstGroup.lessonNumber = `${i + 1}`;
      dailyLesson.push(lessonFirstGroup);

      if ('secondGroup' in this.emittedDays[dailySubjects].value[i]) {
        const lessonSecondGroup = {
          lessonNumber: '',
          subjectId: 0,
          subjectName: '',
          subjectDescription: ''
        }
        Object.keys(lessonSecondGroup).forEach(keyName =>
          lessonSecondGroup[keyName] = this.emittedDays[dailySubjects].value[i].secondGroup[keyName]);
          lessonSecondGroup.lessonNumber = `${i + 1}`;
          dailyLesson.push(lessonSecondGroup);
      }
    }
    return dailyLesson;
  }
}
