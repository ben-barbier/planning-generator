import {Course, Teacher} from './models';

export const teachers: Teacher[] = [
    {id: 'bob', vacations: ['2019-05-13 AM', '2019-05-15 AM', '2019-05-15 PM']},
    {id: 'alice', vacations: ['2019-05-13 AM']},
];

export const timeSlots: string[] = [
    '2019-05-13 AM',
    '2019-05-13 PM',
    '2019-05-14 AM',
    '2019-05-14 PM',
    '2019-05-15 AM',
    '2019-05-15 PM',
];

export const courses: Course[] = [
    {id: 'WEB-2', description: 'JS', teachersIds: ['bob'], coursesPreconditionsIds: ['SOFT-1', 'WEB-1']},
    {id: 'SOFT-2', description: 'Gestion des conflits', teachersIds: ['alice'], coursesPreconditionsIds: ['SOFT-1']},
    {id: 'WEB-1', description: 'HTML', teachersIds: ['bob'], coursesPreconditionsIds: ['SOFT-1']},
    {id: 'SOFT-1', description: 'Accueil', teachersIds: ['alice'], coursesPreconditionsIds: []},
];
