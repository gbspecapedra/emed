
import React from 'react';
import { Patient } from '@/models/patient.model';
import { PrintText, PrintTitle, SpaceLine } from '@/components/report';
import { Exam } from '@/models/exam.model';
import { Medicine } from '@/models/medicine.model';

interface IPrescriptionProps {
  patient: Pick<Patient, "name">
  exams: Exam[]
  medicines: Medicine[]
}

export const Prescription = ({patient, exams, medicines}: IPrescriptionProps) => {
  return (
    <>
      <PrintTitle title="Prescription" level={3} />
      <SpaceLine />
      <PrintText>Name: {patient.name}</PrintText>
      <SpaceLine />
      <PrintTitle title="Requests" level={6} />
      {exams.length > 0 && exams.map(exam => {
        return <PrintText>{exam.name}</PrintText>;
      })}
      <SpaceLine />
      {medicines.length > 0 && medicines.map(medicine => {
        return <PrintText>{medicine.name} {medicine.concentration} {medicine.usage} ({medicine.producer})</PrintText>;
      })}
    </>
  );
};
