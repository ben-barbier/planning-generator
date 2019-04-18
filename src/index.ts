import {Course} from './models';
import {
    addEmptyCoursesAtTheEnd,
    displayMessage,
    displayPlanning,
    displayProgression,
    getRepartitionScore,
    isIncoherent,
    shuffleCourses,
    shuffleSubPlanning,
    swapCourses
} from './utils';
import {getCourses, readFile} from './courses';
import {timeSlots} from './timeSlots';
import {teachers} from './teachers';

const maxIterations = 10000;

(function () {

    getCourses(readFile('courses.csv')).then(courses => {

        // Check that there are enough time slots
        if (courses.length > timeSlots.length) {
            displayMessage('There are more courses than time slots 😤.');
            return;
        } else {
            // Add empty courses on list
            const numberOfEmptyCoursesToAdd = timeSlots.length - courses.length;
            courses = addEmptyCoursesAtTheEnd(courses, numberOfEmptyCoursesToAdd);
        }

        let results: { planning: Course[], score: number }[] = [];

        for (let i = 0; i < maxIterations; i++) {
            setTimeout(() => {
                try {
                    const planningWithScore = generatePlanning(courses);
                    results.push(planningWithScore);
                } catch (error) {
                } finally {
                    displayProgression(results.length);
                }
            }, 0);
        }

        setTimeout(() => {
            const result = results.sort((a, b) => b.score - a.score)[0];

            if (result.score === 0) {
                displayMessage('No perfect planning detected 😤.');
            }

            displayPlanning(timeSlots, result.planning);
            displayMessage(`Repartition score: ${result.score} / 100`);
        }, 0);

    });

})();

function generatePlanning(courses: Course[]): { planning: Course[], score: number } {
    let planning = shuffleCourses(courses);
    let courseToValidateIdx = 0;
    while (courseToValidateIdx < planning.length) {
        if (isIncoherent(planning, courseToValidateIdx, teachers, timeSlots)) {
            planning = shuffleSubPlanning(planning, courseToValidateIdx);
            let alternativeIdx = courseToValidateIdx + 1;
            let alternativePlanning = swapCourses(planning, courseToValidateIdx, alternativeIdx);
            while (isIncoherent(alternativePlanning, courseToValidateIdx, teachers, timeSlots)) {
                alternativeIdx++;
                if (alternativeIdx > timeSlots.length) {
                    throw new Error('Unable to compute planning by this way 😤');
                }
                alternativePlanning = swapCourses(planning, courseToValidateIdx, alternativeIdx);
            }
            planning = alternativePlanning;
        }
        courseToValidateIdx++;
    }
    return {planning, score: getRepartitionScore(planning, timeSlots)};
}
