export const defaultValues: translation | any = {
  id: "",
  code: "",
  name: "",
  nameLang: {
    en_US: "",
    ar_SA: "",
    fr_FR: "",
  },
};

interface translation {
  id: string;
  code: string;
  name: string;
}
