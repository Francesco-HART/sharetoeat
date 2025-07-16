/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criticality } from './Criticality';
import type { Frequency } from './Frequency';
import type { PersonInCharge } from './PersonInCharge';
export type LegalObligation = {
    code?: string | null;
    dueDate?: string | null;
    frequency?: Frequency;
    personInCharge?: PersonInCharge;
    criticality?: Criticality;
};

