export interface GenericClass {
  id: string;
  classTemplateInfo?: {
    cardTemplateOverride?: {
      cardRowTemplateInfos?: Array<{
        twoItems?: {
          startItem?: {
            firstValue?: {
              fields?: Array<{
                fieldPath?: string;
              }>;
            };
          };
          endItem?: {
            firstValue?: {
              fields?: Array<{
                fieldPath?: string;
              }>;
            };
          };
        };
      }>;
    };
  };
  imageModulesData?: Array<{
    mainImage?: {
      sourceUri?: {
        uri?: string;
      };
      contentDescription?: {
        defaultValue?: {
          language?: string;
          value?: string;
        };
      };
    };
    id?: string;
  }>;
  textModulesData?: Array<{
    header?: string;
    body?: string;
    id?: string;
  }>;
  linksModuleData?: {
    uris?: Array<{
      uri?: string;
      description?: string;
      id?: string;
    }>;
  };
}
