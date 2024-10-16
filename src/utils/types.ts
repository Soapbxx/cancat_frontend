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

export interface Invitation {
  id: number;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  inviterId: number;
  inviteeId?: number;
  inviter?: {
    id: number;
    email: string;
    name?: string;
  };
  invitee?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface Transaction {
  id: number;
  date: string;
  label: string;
  amount: number;
  custom: string | null;
  tag: Tag | null;
  tagId: number | null;
  pandb: boolean;
  flag: boolean;
  hidden: boolean;
  m: boolean;
  source: string;
}

export interface Rules {
  id: number;
  label: string;
  nickname: string;
}

export interface SharedUser {
  id: number;
  email: string;
  name?: string;
}

export interface Member {
  id: string;
  name: string;
}

export interface Source {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}