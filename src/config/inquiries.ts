export const inquiryTopics = {
  arcani: [
    { value: "corsi-percorsi", label: "Corsi e percorsi" },
    { value: "consulto-personale", label: "Consulto personale" },
    { value: "eventi-esercitazioni", label: "Eventi ed esercitazioni" },
    { value: "altro", label: "Altro" },
  ],
  respiro: [
    { value: "lezione-prova", label: "Lezione o prova" },
    { value: "discipline-percorsi", label: "Discipline e percorsi" },
    { value: "eventi-incontri", label: "Eventi e incontri" },
    { value: "altro", label: "Altro" },
  ],
  ispirazione: [
    { value: "collaborazioni-progetti", label: "Collaborazioni e progetti" },
    { value: "eventi-culturali", label: "Eventi culturali" },
    { value: "contenuti-editoriali", label: "Contenuti editoriali" },
    { value: "altro", label: "Altro" },
  ],
} as const;

export type InquiryPath = keyof typeof inquiryTopics;
export type InquiryTopic = (typeof inquiryTopics)[InquiryPath][number]["value"];

export const inquiryPathLabels: Record<InquiryPath, string> = {
  arcani: "Via degli Arcani",
  respiro: "Via del Respiro",
  ispirazione: "Via dell’Arte",
};

export function getInquiryTopicLabel(path: InquiryPath, topic: string) {
  return inquiryTopics[path].find((item) => item.value === topic)?.label ?? topic;
}
