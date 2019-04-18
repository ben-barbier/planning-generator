import {Course} from '../src/models';
import {addEmptyCoursesAtTheEnd, shuffleSubPlanning} from '../src/utils';
import {getCourses} from '../src/courses';
import {promisify} from 'util';
import * as fs from 'fs';

const readFile = promisify(fs.readFile);

describe('shuffle sub planning', function () {

    it(`shuffle sub planning don't change planning size`, async function () {
        // Given
        const courses: Course[] = await getCourses(readFile('spec/courses.test.csv', 'utf8'));

        // When
        const shuffeledCoures = shuffleSubPlanning(courses, 170);

        // Then
        expect(shuffeledCoures.length).toBe(courses.length);
    });

    it('shuffle sub planning let empty timeslots at the end', async function () {
        // Given
        let courses: Course[] = await getCourses(readFile('spec/courses.test.csv', 'utf8'));
        const expectedNumberOfEmptyTimeSlotsAtTheEnd = 10;
        courses = addEmptyCoursesAtTheEnd(courses, expectedNumberOfEmptyTimeSlotsAtTheEnd);

        // When
        const shuffeledCoures = shuffleSubPlanning(courses, 170);

        // Then
        const numberOfEmptyTimeslotsAtTheEnd = shuffeledCoures.reduceRight((acc, course) => {
            return (course || acc.stop) ? {count: acc.count, stop: true} : {count: acc.count + 1, stop: false};
        }, {count: 0, stop: false}).count;
        expect(expectedNumberOfEmptyTimeSlotsAtTheEnd).toEqual(numberOfEmptyTimeslotsAtTheEnd);
    });

});

