using { newjoiner } from '../db/data-model';

 @path : '/catalog'

 service CatalogService {
    entity Developers as projection on newjoiner.Developers;
    entity LearningPaths as projection on newjoiner.LearningPaths;
    entity DeveloperLearningPaths as projection on newjoiner.DeveloperLearningPaths;
}
