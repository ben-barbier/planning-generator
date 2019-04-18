import {Course} from './models';
import Papa = require('papaparse');

export function readFile(fileUrl: string): Promise<string> {
    return fetch(fileUrl)
        .catch(e => {
            throw new Error(`Unable to find file ${fileUrl} 😤.`);
        })
        .then(response => response.text());
}

export function getCourses(fileContent: Promise<string>): Promise<Course[]> {
    return fileContent
        .then((csv: string) => Papa.parse(csv).data)
        .then((coursesArrays: string[][]) => coursesArrays.filter(c => c.length >= 3))
        .then((coursesArrays: string[][]): Course[] => {
            return coursesArrays.map((courseArray: string[]): Course | null => {
                return {
                    id: courseArray[0],
                    matter: courseArray[1],
                    teachersIds: courseArray[2].split('+'),
                    description: courseArray[3],
                    coursesPreconditionsIds: courseArray[4] ? courseArray[4].split('+') : [],
                    date: courseArray[5]
                };
            });
        });
}
