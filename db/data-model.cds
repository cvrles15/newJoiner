namespace newjoiner;

using { managed } from '@sap/cds/common';

entity Developers : managed {
    key ID : UUID;
    name : String(100);
    email : String(150);
    role : String(50);
    startDate : Date;
}

entity LearningPaths : managed {
    key ID : UUID;
    skillArea : String(50);
    level : String(20);
    link : String(200);
    description : String(200);
    estimatedCompletionTime : Integer; // En horas.
}

entity DeveloperLearningPaths : managed {
    key ID : UUID;
    developer : Association to Developers; // Relación con el usuario.
    learningPath : Association to LearningPaths; // Relación con la ruta de aprendizaje.
    status : String(20); // 'Pending', 'In Progress', 'Completed'.
    progress : Decimal(5, 2); // Porcentaje completado (0-100%).
}
