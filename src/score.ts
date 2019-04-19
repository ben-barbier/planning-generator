import {Course} from './models';

export function getScore(planning: Course[], timeSlots: string[]): number {
    const points = planning.reduce((acc, course, idx, arr) => {
        const previousCourse = arr[idx - 1];
        if (!previousCourse || !course) {
            return acc + 1;
        } else if (course && course.date) {
            return acc + 1;
        } else if (course.matter !== previousCourse.matter) {
            return acc + 1;
        } else {
            return acc;
        }
    }, 0);
    return points / timeSlots.length * 100;
}
