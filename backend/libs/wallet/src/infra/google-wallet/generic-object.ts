export interface GenericObject {
  id: string;
  classId: string;
  genericType: string;
  hexBackgroundColor?: string;
  logo?: {
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
  cardTitle?: {
    defaultValue?: {
      language?: string;
      value?: string;
    };
  };
  subheader?: {
    defaultValue?: {
      language?: string;
      value?: string;
    };
  };
  header?: {
    defaultValue?: {
      language?: string;
      value?: string;
    };
  };
  textModulesData?: Array<{
    header?: string;
    body?: string;
    id?: string;
  }>;
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
  barcode?: {
    type?: string;
    value?: string;
    alternateText?: string;
  };
  heroImage?: {
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
}
