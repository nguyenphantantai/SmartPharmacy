// Export tất cả các data services
export { DiseaseDataService } from './disease-data';
export type { 
  DiseaseItem, 
  BodyPart, 
  Specialty, 
  DiseaseGroup 
} from './disease-data';

// Export các data services khác nếu có
export * from './beauty-care';
export * from './medical-devices';
export * from './mom-baby';
export * from './personal-care';
export * from './supplements';
export * from './vietnam-addresses';
