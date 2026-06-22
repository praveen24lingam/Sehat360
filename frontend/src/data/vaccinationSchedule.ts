import { VaccineScheduleItem } from '@/types'

export const VACCINATION_SCHEDULE: VaccineScheduleItem[] = [
  { id: 'bcg',       name: 'BCG',              dueAgeDays: 0,    dueLabelKey: 'vaccines.due.birth',    descriptionKey: 'vaccines.bcg.desc' },
  { id: 'hepb0',     name: 'Hepatitis B',       dueAgeDays: 0,    dueLabelKey: 'vaccines.due.birth',    descriptionKey: 'vaccines.hepb.desc' },
  { id: 'opv0',      name: 'OPV (0 dose)',       dueAgeDays: 0,    dueLabelKey: 'vaccines.due.birth',    descriptionKey: 'vaccines.opv.desc' },
  { id: 'penta1',    name: 'Pentavalent 1',      dueAgeDays: 42,   dueLabelKey: 'vaccines.due.6weeks',   descriptionKey: 'vaccines.penta.desc' },
  { id: 'opv1',      name: 'OPV 1',             dueAgeDays: 42,   dueLabelKey: 'vaccines.due.6weeks',   descriptionKey: 'vaccines.opv.desc' },
  { id: 'penta2',    name: 'Pentavalent 2',      dueAgeDays: 70,   dueLabelKey: 'vaccines.due.10weeks',  descriptionKey: 'vaccines.penta.desc' },
  { id: 'opv2',      name: 'OPV 2',             dueAgeDays: 70,   dueLabelKey: 'vaccines.due.10weeks',  descriptionKey: 'vaccines.opv.desc' },
  { id: 'penta3',    name: 'Pentavalent 3',      dueAgeDays: 98,   dueLabelKey: 'vaccines.due.14weeks',  descriptionKey: 'vaccines.penta.desc' },
  { id: 'opv3',      name: 'OPV 3',             dueAgeDays: 98,   dueLabelKey: 'vaccines.due.14weeks',  descriptionKey: 'vaccines.opv.desc' },
  { id: 'ipv',       name: 'IPV',               dueAgeDays: 98,   dueLabelKey: 'vaccines.due.14weeks',  descriptionKey: 'vaccines.ipv.desc' },
  { id: 'measles1',  name: 'Measles-Rubella 1',  dueAgeDays: 270,  dueLabelKey: 'vaccines.due.9months',  descriptionKey: 'vaccines.mr.desc' },
  { id: 'vita1',     name: 'Vitamin A (1st)',     dueAgeDays: 270,  dueLabelKey: 'vaccines.due.9months',  descriptionKey: 'vaccines.vita.desc' },
  { id: 'dpt1',      name: 'DPT Booster 1',      dueAgeDays: 548,  dueLabelKey: 'vaccines.due.18months', descriptionKey: 'vaccines.dpt.desc' },
  { id: 'measles2',  name: 'Measles-Rubella 2',  dueAgeDays: 548,  dueLabelKey: 'vaccines.due.18months', descriptionKey: 'vaccines.mr.desc' },
]