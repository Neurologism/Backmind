import mongoose from 'mongoose';

const mongooseTutorialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  summary: { type: String, required: true, default: '' }, // Kurzbeschreibung
  description: { type: String, required: true, default: '' }, // etwas ausführlichere Beschreibung
  ownerId: mongoose.Types.ObjectId, // Ersteller des Tutorials
  visibility: { type: String, enum: ['public', 'private'], required: true },
  dateCreatedAt: { type: Date, required: true, default: () => new Date() },
  dateLastEdited: { type: Date, required: true, default: () => new Date() },
  requiredTutorials: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  }, // Tutorials, die abgeschlossen sein müssen bevor dieses Tutorial angefangen wird
  nextTutorials: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  }, // follow-ups (in der Regel wird dieses Array nur ein einziges weiteres Tutorial enthalten)
  experienceGain: { type: Number, required: true, default: 100 }, // Erfahrungspunkte, die man für den Abschluss des Tutorials erhält. Wird zwar erstmal noch nicht benutzt, spart aber Zeit beim zukünftigen implementieren, wenn wir schonmal das Attribut definiert haben.
  startProject: mongoose.Types.ObjectId, // components, die bereits zu Beginn des tutorials platziert sind
  availableNodes: { type: [], required: true, default: [] }, // nodes, die zu Beginn des Tutorials freigeschaltet sind
  steps: {
    type: [
      {
        text: { type: String, required: true, default: '' }, // Erklärtext des jeweiligen Tutorial-Schritts
        narrator: { type: String, required: true, default: '' }, // jeder Erzähler bekommt einen String als Identifikation. Im Frontend wird dann auf Basis des Narrators auch ein kleines Bild angezeigt (bei unbekanntem Narrator einfach leeres Bild)
        addNodes: { type: [], required: true, default: [] }, // alle Components, die der user hinzufügen muss, um zum nächsten Schritt zu gelangen (kann selbstverständlich auch leer sein)
        addEdges: { type: [], required: true, default: [] }, // alle Verbindungen, die hinzugefügt werden müssen
        highlightNodeTypes: { type: [], required: true, default: [] }, // enthält uids von den Blocktypen, die eine highlight-Animation erhalten sollen
        unlockNodes: { type: [], required: true, default: [] }, // nodes, die ab diesem Schritt im tutorial freigeschaltet werden
      },
    ],
    required: true,
    default: [],
  },
});

mongooseTutorialSchema.pre('save', function (next) {
  this.dateLastEdited = new Date();
  next();
});

export const TutorialModel = mongoose.model(
  'tutorials',
  mongooseTutorialSchema
);
