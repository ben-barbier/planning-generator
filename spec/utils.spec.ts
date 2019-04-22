import {Course, Teacher} from '../src/models';
import {addEmptyCoursesAtTheEnd, isIncoherent, shuffleSubPlanning} from '../src/utils';
import {getCourses} from '../src/courses';
import {promisify} from 'util';
import * as fs from 'fs';

const readFile = promisify(fs.readFile);

describe('isIncoherent', function () {

    it(`isIncoherent - right planning`, async function () {
        // Given
        const allTimeSlots: string[] = ['2019-05-13 AM', '2019-05-13 PM'];
        const planning: Course[] = [
            {id: 'ALGO-1', description: 'Desc 1', teachersIds: ['bob'], coursesPreconditionsIds: [], date: '2019-05-13 AM'},
            {id: 'ALGO-2', description: 'Desc 2', teachersIds: ['bob', 'alice'], coursesPreconditionsIds: ['ALGO-1']},
        ];
        const allTeachers: Teacher[] = [
            {id: 'bob', vacations: []},
            {id: 'alice', vacations: []},
        ];
        const idx: number = 0;

        // When
        const result = isIncoherent(planning, idx, allTeachers, allTimeSlots);

        // Then
        expect(result).toBe(false);
    });

    it(`isIncoherent - missing precondition fail`, async function () {
        // Given
        const allTimeSlots: string[] = ['2019-05-13 AM', '2019-05-13 PM'];
        const planning: Course[] = [
            {id: 'ALGO-2', description: 'Desc 2', teachersIds: ['bob', 'alice'], coursesPreconditionsIds: ['ALGO-1']},
            {id: 'ALGO-1', description: 'Desc 1', teachersIds: ['bob'], coursesPreconditionsIds: []},
        ];
        const allTeachers: Teacher[] = [
            {id: 'bob', vacations: []},
            {id: 'alice', vacations: []},
        ];
        const idx: number = 0;

        // When
        const result = isIncoherent(planning, idx, allTeachers, allTimeSlots);

        // Then
        expect(result).toBe(true);
    });

    it(`isIncoherent - course teachers on vacation`, async function () {
        // Given
        const allTimeSlots: string[] = ['2019-05-13 AM', '2019-05-13 PM'];
        const planning: Course[] = [
            {id: 'ALGO-1', description: 'Desc 1', teachersIds: ['bob'], coursesPreconditionsIds: []},
            {id: 'ALGO-2', description: 'Desc 2', teachersIds: ['bob', 'alice'], coursesPreconditionsIds: ['ALGO-1']},
        ];
        const allTeachers: Teacher[] = [
            {id: 'bob', vacations: ['2019-05-13 AM']},
            {id: 'alice', vacations: []},
        ];
        const idx: number = 0;

        // When
        const result = isIncoherent(planning, idx, allTeachers, allTimeSlots);

        // Then
        expect(result).toBe(true);
    });

    it(`isIncoherent - another course scheduled on that date`, async function () {
        // Given
        const allTimeSlots: string[] = ['2019-05-13 AM', '2019-05-13 PM'];
        const planning: Course[] = [
            {id: 'ALGO-1', description: 'Desc 1', teachersIds: ['bob'], coursesPreconditionsIds: []},
            {id: 'ALGO-2', description: 'Desc 2', teachersIds: ['bob', 'alice'], coursesPreconditionsIds: ['ALGO-1'], date: '2019-05-13 AM'},
        ];
        const allTeachers: Teacher[] = [
            {id: 'bob', vacations: []},
            {id: 'alice', vacations: []},
        ];
        const idx: number = 0;

        // When
        const result = isIncoherent(planning, idx, allTeachers, allTimeSlots);

        // Then
        expect(result).toBe(true);
    });

    it(`isIncoherent - course scheduled to another date`, async function () {
        // Given
        const allTimeSlots: string[] = ['2019-05-13 AM', '2019-05-13 PM'];
        const planning: Course[] = [
            {id: 'ALGO-1', description: 'Desc 1', teachersIds: ['bob'], coursesPreconditionsIds: [], date: '2019-05-13 PM'},
            {id: 'ALGO-2', description: 'Desc 2', teachersIds: ['bob', 'alice'], coursesPreconditionsIds: []},
        ];
        const allTeachers: Teacher[] = [
            {id: 'bob', vacations: []},
            {id: 'alice', vacations: []},
        ];
        const idx: number = 0;

        // When
        const result = isIncoherent(planning, idx, allTeachers, allTimeSlots);

        // Then
        expect(result).toBe(true);
    });

});

describe('shuffleSubPlanning', function () {

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

