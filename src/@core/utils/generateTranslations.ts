export default function generateTranslations(data: any) {
  let myTransList: any = {};
  let myTransList2: any = {};
  let myTransList4: any = {};
  let resources = {};

  data?.data?.map((value: any, index: any) => {
    myTransList[value?.name] = [value?.nameLang];
    myTransList2[value?.name] = value.nameLang["en_US"];
    myTransList4[value?.name] = value.nameLang["ar_SA"];
  });

  Object.keys(myTransList).map((lang) => {
    resources = {
      ...resources,
      ["en-US"]: {
        translation: myTransList2,
      },
      ["ar-SA"]: {
        translation: myTransList4,
      },
    };
  });
  return resources;
}
