import {Course} from './models';
import {courses, teachers, timeSlots} from './inputs';
import {displayMessage, displayPlanning, isIncoherent, shuffleCourses, swapCourses} from './utils';

(function () {

    // Check that there are enough time slots
    if (courses.length > timeSlots.length) {
        displayMessage('There are more courses than time slots 😤.');
        return;
    }

    let results: { planning: Course[], score: number }[] = [];

    for (let i = 0; i < 1000; i++) {
        let planning = shuffleCourses(courses);
        let courseToValidateIdx = 0;
        while (courseToValidateIdx < planning.length) {
            if (isIncoherent(planning, courseToValidateIdx, teachers, timeSlots)) {
                let alternativeIdx = courseToValidateIdx + 1;
                let alternativePlanning = swapCourses(planning, courseToValidateIdx, alternativeIdx);
                while (isIncoherent(alternativePlanning, courseToValidateIdx, teachers, timeSlots)) {
                    alternativeIdx++;
                    alternativePlanning = swapCourses(planning, courseToValidateIdx, alternativeIdx);
                }
                planning = alternativePlanning;
            }
            courseToValidateIdx++;
        }
        const score = timeSlots.length / planning.length;
        results = results.concat({planning, score});
    }

    const result = results.sort((a, b) => b.score - a.score)[0];

    if (result.score !== 1) {
        displayMessage('No perfect planning detected 😤.');
    }

    displayPlanning(timeSlots, result.planning);

})();
