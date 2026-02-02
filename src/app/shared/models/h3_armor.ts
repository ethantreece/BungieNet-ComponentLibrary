export enum H3ArmorClassifications {
  SPARTAN = 0,
  ELITE = 1,
}

export const H3ArmorClassificationNames: Record<H3ArmorClassifications, string> = {
  [H3ArmorClassifications.SPARTAN]: 'spartan',
  [H3ArmorClassifications.ELITE]: 'elite',
};

export enum H3Armors {
  MARK6 = 0,
  CQB = 1,
  EVA = 2,
  EOD = 3,
  HAYABUSA = 4,
  SECURITY = 5,
  SCOUT = 6,
  ODST = 7,
  MARK5 = 8,
  ROGUE = 9,
  RECON = 10,
  BUNGIE = 11,
  KATANA = 12,
}   

export const H3ArmorNames: Record<H3Armors, string> = {
  [H3Armors.MARK6]: 'base',
  [H3Armors.CQB]: 'mp_cobra',
  [H3Armors.EVA]: 'mp_intruder',
  [H3Armors.EOD]: 'mp_regulator',
  [H3Armors.HAYABUSA]: 'mp_ryu',
  [H3Armors.SECURITY]: 'mp_marathon',
  [H3Armors.SCOUT]: 'mp_scout',
  [H3Armors.ODST]: 'mp_odst',
  [H3Armors.MARK5]: 'mp_markv',
  [H3Armors.ROGUE]: 'mp_rogue',
  [H3Armors.RECON]: 'mp_ninja',
  [H3Armors.BUNGIE]: 'mp_bungie',
  [H3Armors.KATANA]: 'mp_katana',
};

export const H3ArmorDisplayNames: Record<H3Armors, string> = {
  [H3Armors.MARK6]: 'Mark VI',
  [H3Armors.CQB]: 'C.Q.B.',
  [H3Armors.EVA]: 'E.V.A.',
  [H3Armors.EOD]: 'E.O.D.',
  [H3Armors.HAYABUSA]: 'Hayabusa',
  [H3Armors.SECURITY]: 'Security',
  [H3Armors.SCOUT]: 'Scout',
  [H3Armors.ODST]: 'ODST',
  [H3Armors.MARK5]: 'Mark V',
  [H3Armors.ROGUE]: 'Rogue',
  [H3Armors.RECON]: 'Recon',
  [H3Armors.BUNGIE]: 'Bungie',
  [H3Armors.KATANA]: 'Katana',
};

export interface H3ArmorAvailability {
  helmets: H3Armors[];
  shoulders: H3Armors[];
  chests: H3Armors[];
}

export const SpartanArmorOptions: H3ArmorAvailability = {
  helmets: [
    H3Armors.MARK6,
    H3Armors.CQB,
    H3Armors.EVA,
    H3Armors.EOD,
    H3Armors.HAYABUSA,
    H3Armors.SECURITY,
    H3Armors.SCOUT,
    H3Armors.ODST,
    H3Armors.MARK5,
    H3Armors.ROGUE,
    H3Armors.RECON,
  ],
  shoulders: [
    H3Armors.MARK6,
    H3Armors.CQB,
    H3Armors.EVA,
    H3Armors.EOD,
    H3Armors.HAYABUSA,
    H3Armors.SECURITY,
    H3Armors.SCOUT,
    H3Armors.RECON,
  ],
  chests: [
    H3Armors.MARK6,
    H3Armors.CQB,
    H3Armors.EVA,
    H3Armors.EOD,
    H3Armors.HAYABUSA,
    H3Armors.KATANA,
  ],
};
