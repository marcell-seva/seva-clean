export enum DealerIdentifier {
  TSO = 'TS',
  DSO = 'DS',
  BSO = 'BS',
  ISO = 'IS',
  PSO = 'PS',
  ACC = 'AC',
  TAF = 'TA',
  PERMATABANK = 'PB',
  FIFGROUP = 'FI',
  AAB = 'AA',
  ASTRALIFE = 'AL',
  SEVA = 'SE',
  MOXA = 'MO',
  ASTRAPAY = 'AP',
  MAUCASH = 'MA',
}

export enum SupportedBrand {
  toyota = 'Toyota',
  daihatsu = 'Daihatsu',
  bmw = 'BMW',
}

export enum AttendeeBrandCar {
  TOYOTA = 'Toyota',
  DAIHATSU = 'Daihatsu',
  PEUGEOT = 'Peugeot',
  ISUZU = 'Isuzu',
  BMW = 'BMW',
  LEXUS = 'Lexus',
  OTHERS = 'Lainnya',
}

export enum CrmBussinessUnits {
  ACC = 'ACC',
  TAF = 'TAF',
  FIF = 'FIFGROUP',
  AAB = 'Asuransi Astra',
  PERMATA_BANK = 'PermataBank',
  SEVA = 'SEVA',
  ASTRA_LIFE = 'Astra Life',
  ASTRA_PAY = 'AstraPay',
  MOXA = 'Moxa',
  MAU_CASH = 'Maucash',
  BSO = 'Astra BMW',
  DSO = 'Astra Daihatsu',
}

export enum NewFunnelLoanRank {
  Red = 'Red',
  Yellow = 'Yellow',
  Green = 'Green',
  Grey = 'Grey',
}

export enum NewFunnelLoanRankSeva {
  Red = 'Green',
  Yellow = 'Yellow',
  Green = 'Red',
  Grey = 'Grey',
}
export enum NewFunnelLoanPermutationsKey {
  DpAmount = 'dpAmount',
  LoanRank = 'loanRank',
  MonthlyInstallment = 'monthlyInstallment',
  Tenure = 'tenure',
  DpPercentage = 'dpPercentage',
}

export enum NewFunnelLoanPermutationsKeySeva {
  DpAmount = 'dpAmount',
  LoanRankSeva = 'loanRankSeva',
  MonthlyInstallment = 'monthlyInstallment',
  Tenure = 'tenure',
  DpPercentage = 'dpPercentage',
}

export enum CompanyOption {
  seva = 'SEVA',
  dso = 'DSO',
  tso = 'TSO',
  bso = 'BSO',
  iso = 'ISO',
  pso = 'PSO',
  acc = 'ACC',
  taf = 'TAF',
  fif = 'FIFGROUP',
  asuransiAstra = 'AAB',
  astraLife = 'ASTRALIFE',
  permataBank = 'PERMATABANK',
  moxa = 'MOXA',
  astraPay = 'ASTRAPAY',
  mauCash = 'MAUCASH',
  astridoToyota = 'ASTRIDOTOYOTA',
  plazaTOYOTA = 'PLAZATOYOTA',
  tunasTOYOTA = 'TUNASTOYOTA',
  SETIAJAYATOYOTA = 'SETIAJAYATOYOTA',
  dayaTOYOTA = 'DAYATOYOTA',
  dawDAIHATSU = 'DAWDAIHATSU',
  karyaZirangUtamaDAIHATSU = 'KARYAZIRANGUTAMADAIHATSU',
  PRADHANARAYAMOBILINDODAIHATSU = 'PRADHANARAYAMOBILINDODAIHATSU',
  TRIMANDIRISELARASDAIHATSU = 'TRIMANDIRISELARASDAIHATSU',
  ARMADAAUTOTARADAIHATSU = 'ARMADAAUTOTARADAIHATSU',
  ASCODAIHATSU = 'ASCODAIHATSU',
  ASTRIDODAIHATSU = 'ASTRIDODAIHATSU',
  PRIMAPARAMAMOBILINDODAIHATSU = 'PRIMAPARAMAMOBILINDODAIHATSU',
  TUNASDAIHATSU = 'TUNASDAIHATSU',
  ANZONAUTOLESTARITOYOTA = 'ANZONAUTOLESTARITOYOTA',
  KHARISMADHAIHATSU = 'KHARISMADAIHATSU',
  ARMADADAIHATSU = 'ARMADADAIHATSU',
  KARUNIADAIHATSU = 'KARUNIADAIHATSU',
  LIEKMOTOR = 'LIEKMOTOR',
  ASRIMOTOR = 'ASRIMOTOR',
  ARINA = 'ARINA',
  others = 'OTHER',
}

export enum Seats {
  LessThanOrEqualTo5Seater = '0',
  MoreThan5Seater = '1',
}

export enum LoanRank {
  Green = 'Green',
  Yellow = 'Yellow',
  Red = 'Red',
}

export enum LoanRankSeva {
  Red = 'Red',
  Blue = 'Blue',
  Grey = 'Grey',
}
export enum CarTileSize {
  Big = 'Big',
  Small = 'Small',
}

export enum VariantFuelType {
  Diesel = 'Diesel',
  Petrol = 'Bensin',
  Hybrid = 'Hybrid',
  Electric = 'Electric',
}

export enum VariantTransmissionType {
  Manual = 'Manual',
  Automatic = 'Otomatis',
}

export enum VariantBodyType {
  MPV = 'MPV',
  SUV = 'SUV',
  Commercial = 'COMMERCIAL',
  Hatchback = 'HATCHBACK',
  Sedan = 'SEDAN',
  Sport = 'SPORT',
}

export enum VariantSpecificationsType {
  BodyType = 'bodyType',
  FuelType = 'fuelType',
  Transmission = 'Transmission',
  EngineCapacity = 'EngineCapacity',
  CarSeats = 'CarSeats',
  Length = 'length',
}
