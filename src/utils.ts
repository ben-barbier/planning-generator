import {Course, Teacher} from './models';
import {timeSlots} from './inputs';

export function shuffleCourses(courses: Course[]): Course[] {
    let planning = [...courses].sort(() => Math.random() - 0.5);
    planning.length = timeSlots.length;
    return planning;
}

export function displayPlanning(timeSlots: string[], planning: Course[]): void {
    let planningToDisplay = timeSlots.map((timeSlot, idx) => {
        if (planning[idx]) {
            return `${timeSlot};${planning[idx].id};${planning[idx].matter};${planning[idx].teachersIds};${planning[idx].description};${planning[idx].coursesPreconditionsIds};${planning[idx].date}`;
        } else {
            return `${timeSlot} - EMPTY`;
        }
    });
    console.table(planningToDisplay);
    document.getElementById('planning').innerHTML = planningToDisplay.join('\n');
}

export function displayMessage(message: string): void {
    document.getElementById('message').innerHTML = message;
}

const getTeachersByIds = (ids: string[], teachers: Teacher[]): Teacher[] => {
    return ids.map((teacherId: string): Teacher =>
        teachers.find((teacher: Teacher): boolean =>
            teacher.id === teacherId));
};

const getVacations = (teachers: Teacher[]): string[] => {
    return teachers.reduce((vacations: string[], teacher: Teacher): string[] => {
        return vacations.concat(teacher.vacations);
    }, []);
};

const courseTeachersOnVacation = (course: Course, timeSlot: string, allTeachers: Teacher[]): boolean => {
    const courseTeachers = getTeachersByIds(course.teachersIds, allTeachers);
    const vacations = getVacations(courseTeachers);
    return !!vacations.includes(timeSlot);
};

const preconditionsValidated = (previousCourses: Course[], course: Course): boolean => {
    const previousCoursesIds = previousCourses.filter(Boolean).map(course => course.id);
    return course.coursesPreconditionsIds.every(preconditionId =>
        previousCoursesIds.includes(preconditionId)
    );
};

export function anotherCourseScheduledOnThatDate(course: Course, timeSlot: string, planning: Course[]): boolean {
    const courseScheduledOnThatDate = planning.filter(Boolean).find(course => course.date === timeSlot);
    return !course ? !!courseScheduledOnThatDate : !!courseScheduledOnThatDate && courseScheduledOnThatDate.id !== course.id;
}

function courseScheduledToAnotherDate(course: Course, timeSlot: string): boolean {
    return course.date && course.date !== timeSlot;
}

export function isIncoherent(planning: Course[], idx: number, allTeachers: Teacher[], allTimeSlots: string[]): boolean {

    const courseToValidate = planning[idx];
    const timeSlotToValidate = allTimeSlots[idx];

    return (courseToValidate && !preconditionsValidated(planning.slice(0, idx), courseToValidate)) ||
        (courseToValidate && courseTeachersOnVacation(courseToValidate, timeSlotToValidate, allTeachers)) ||
        (anotherCourseScheduledOnThatDate(courseToValidate, timeSlotToValidate, planning) ||
        (courseToValidate && courseScheduledToAnotherDate(courseToValidate, timeSlotToValidate)));
}

export function swapCourses(planning: Course[], incoherenceIdx: number, alternativeIdx: number): Course[] {
    const results = planning.slice();
    const firstItem = planning[incoherenceIdx];
    results[incoherenceIdx] = planning[alternativeIdx];
    results[alternativeIdx] = firstItem;
    return results;
}

