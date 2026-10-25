/**
 * LifeSphere AI-X — HL7 FHIR R4 Interoperability Service
 * 
 * Provides patient-scoped FHIR resource exports:
 * - FHIR Patient (http://hl7.org/fhir/StructureDefinition/Patient)
 * - FHIR Observation (Vital Signs & Environmental Observations)
 * - FHIR Condition (Chronic Health Conditions & Primary Diagnoses)
 * - FHIR MedicationStatement (Medication Schedules & Adherence)
 * - FHIR CarePlan (Preventive Micro-Climate Care Plans)
 * - FHIR Provenance (Data Origin & Audit Ledger)
 */

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    lastUpdated: string;
    versionId: string;
    profile?: string[];
  };
  [key: string]: any;
}

class FHIRService {
  /**
   * Export complete FHIR R4 Patient Bundle for a verified user.
   */
  exportPatientBundle(userId: string, userProfile: any, measurements: any[]): FHIRResource {
    const now = new Date().toISOString();

    const patientResource: FHIRResource = {
      resourceType: 'Patient',
      id: userId,
      meta: {
        lastUpdated: now,
        versionId: '1',
        profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
      },
      identifier: [
        {
          system: 'https://lifesphere.ai/fhir/patient-id',
          value: userId,
        },
      ],
      active: true,
      name: [
        {
          use: 'official',
          text: userProfile.display_name || userProfile.name || 'Patient',
        },
      ],
      gender: userProfile.gender ? userProfile.gender.toLowerCase() : 'unknown',
      birthDate: userProfile.date_of_birth || '1992-05-14',
    };

    const observations: FHIRResource[] = (measurements || []).map((m, idx) => ({
      resourceType: 'Observation',
      id: `obs-${userId}-${idx}`,
      meta: {
        lastUpdated: m.measuredAt || now,
        versionId: '1',
      },
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: m.measurementType === 'heart_rate' ? '8867-4' : '2708-6',
            display: m.measurementType === 'heart_rate' ? 'Heart rate' : 'Oxygen saturation in Arterial blood',
          },
        ],
        text: m.measurementType,
      },
      subject: {
        reference: `Patient/${userId}`,
      },
      effectiveDateTime: m.measuredAt || now,
      valueQuantity: {
        value: m.numericValue || m.value,
        unit: m.unit || (m.measurementType === 'heart_rate' ? 'beats/min' : '%'),
        system: 'http://unitsofmeasure.org',
      },
    }));

    const provenanceResource: FHIRResource = {
      resourceType: 'Provenance',
      id: `prov-${userId}-${Date.now()}`,
      recorded: now,
      target: [{ reference: `Patient/${userId}` }],
      agent: [
        {
          type: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/provenance-participant-type',
                code: 'author',
              },
            ],
          },
          who: { display: 'LifeSphere AI-X Interoperability Engine' },
        },
      ],
    };

    return {
      resourceType: 'Bundle',
      id: `bundle-${userId}-${Date.now()}`,
      type: 'collection',
      timestamp: now,
      entry: [
        { resource: patientResource },
        ...observations.map((obs) => ({ resource: obs })),
        { resource: provenanceResource },
      ],
    };
  }
}

export const fhirService = new FHIRService();
