import {Course, Teacher} from './models';

export function addEmptyCoursesAtTheEnd(courses: Course[], numberOfEmptyCoursesToAdd: number): Course[] {
    const emptyCourses = 'x'.repeat(numberOfEmptyCoursesToAdd).split('').map(() => null);
    return courses.concat(emptyCourses);
}

export function shuffleCourses(courses: Course[]): Course[] {
    const numberOfEmptyTimeslotsAtTheEnd = courses.reduceRight((acc, course) => {
        return (course || acc.stop) ? {count: acc.count, stop: true} : {count: acc.count + 1, stop: false};
    }, {count: 0, stop: false}).count;
    const planning = courses.slice(0, courses.length - numberOfEmptyTimeslotsAtTheEnd).sort(() => Math.random() - 0.5);
    return addEmptyCoursesAtTheEnd(planning, numberOfEmptyTimeslotsAtTheEnd);
}

export function shuffleSubPlanning(planning: Course[], validationIdx: number): Course[] {
    return [
        ...planning.slice(0, validationIdx),
        ...shuffleCourses(planning.slice(validationIdx, planning.length))
    ];
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

export function displayProgression(count: number): void {
    console.log(`Potential planning generated : ${count}`);
    document.getElementById('progression').innerHTML = `Potential planning generated : ${count}`;
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

    return !!((courseToValidate && !preconditionsValidated(planning.slice(0, idx), courseToValidate)) ||
        (courseToValidate && courseTeachersOnVacation(courseToValidate, timeSlotToValidate, allTeachers)) ||
        (anotherCourseScheduledOnThatDate(courseToValidate, timeSlotToValidate, planning) ||
            (courseToValidate && courseScheduledToAnotherDate(courseToValidate, timeSlotToValidate))));
}

export function swapCourses(planning: Course[], incoherenceIdx: number, alternativeIdx: number): Course[] {
    const results = planning.slice();
    results[incoherenceIdx] = planning[alternativeIdx];
    results[alternativeIdx] = planning[incoherenceIdx];
    return results;
}
