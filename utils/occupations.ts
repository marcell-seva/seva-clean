import { Occupation, OccupationNewer } from './types/models'

export const occupations = {
  options: [
    {
      value: Occupation.PrivateCompanyEmployee,
      label: OccupationNewer.KaryawanSwasta,
      isChecked: false,
    },
    {
      value: Occupation.SelfEmployedAndDistributors,
      label: OccupationNewer.WiraswastaDistributor,
      isChecked: false,
    },
    {
      value: Occupation.FarmerAndFishermenAndBreeder,
      label: OccupationNewer.PetaniNelayanPeternak,
      isChecked: false,
    },
    {
      value: Occupation.Other,
      label: OccupationNewer.Lainnya,
      isChecked: false,
    },
    {
      value: Occupation.StayAtHomeMother,
      label: OccupationNewer.IbuRumahTangga,
      isChecked: false,
    },
    {
      value: Occupation.GovernmentEmployeePNS,
      label: OccupationNewer.PegawaiNegeriSipil,
      isChecked: false,
    },
    {
      value: Occupation.TeacherAndProfessorAndResearcher,
      label: OccupationNewer.PengajarPeneliti,
      isChecked: false,
    },
    {
      value: Occupation.PolicemanAndArmyAndSecurity,
      label: OccupationNewer.PolisiAbriKeamanan,
      isChecked: false,
    },
    {
      value: Occupation.Student,
      label: OccupationNewer.PelajarMahasiswa,
      isChecked: false,
    },
    {
      value: Occupation.DoctorAndMedicalWorker,
      label: OccupationNewer.DokterTenagaMedis,
      isChecked: false,
    },
    {
      value: Occupation.Retiree,
      label: OccupationNewer.Pensiunan,
      isChecked: false,
    },
    {
      value: Occupation.InformalWorker,
      label: OccupationNewer.PekerjaInformal,
      isChecked: false,
    },
    {
      value: Occupation.DesignerAndArtsProfessional,
      label: OccupationNewer.DesainerPekerjaSeni,
      isChecked: false,
    },
    {
      value: Occupation.LawProfessional,
      label: OccupationNewer.Hukum,
      isChecked: false,
    },
  ],
}
