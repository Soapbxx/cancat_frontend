export interface Account {
    id: number;
    name: string;
    officialName?: string;
    type: string;
    subtype?: string;
    mask?: string;
    currentBalance?: number;
    availableBalance?: number;
    isoCurrencyCode?: string;
    plaidItem: {
      plaidInstitutionId: string;
      status: string;
    };
  }

