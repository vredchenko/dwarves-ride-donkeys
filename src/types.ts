export type EventType = "domestication" | "chariot" | "cavalry" | "saddle" | "stirrup";

export interface HistoricalEvent {
  id: string;
  year: number;
  uncertainty: number;
  label: string;
  sublabel: string;
  lat: number;
  lng: number;
  type: EventType;
  description: string;
  refs: string[];
}

export interface DivineEntry {
  id: string;
  year: number;
  uncertainty: number;
  label: string;
  sublabel: string;
  lat: number;
  lng: number;
  description: string;
  refs: string[];
}

export type SelectedEntry = HistoricalEvent | DivineEntry;
