export interface TokenResponse {
  access_token: string;
  type: string;
  expires_in: number;
}

export interface HostAddress {
  street: string;
  city: string;
  country: string;
  name: string;
  postcode: string;
}

export interface HostConfigurator {
  name: string;
  referenceName: string;
}

export interface HostCompany {
  name: string;
}

export interface HostCustomer {
  company: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  address: HostAddress;
}

export interface HostUser {
  name: string;
  email: string;
  locale: string;
  role: { name: string };
}

export interface HostProject {
  id: string;
  name: string;
  number: string;
  designer: string;
  address: HostAddress;
  assignments: { id: string; userId: string }[];
  users: { id: string; name: string }[];
}

export interface HostMeta {
  configurator: HostConfigurator;
  project: HostProject;
  user: HostUser;
  company: HostCompany;
  customer: HostCustomer;
  origin: string;
}

export interface HostConfiguration {
  id: string | number;
  createdAt: string;
  name: string;
  parentId: string | null;
  state: Record<string, any>;
}

export interface HostAPI {
  meta: HostMeta;
  configuration: HostConfiguration;
  setUrl: (url: string) => void;
  getUrl: () => string;
  getMeta: () => HostMeta;
  getDictionary: () => Record<string, any>;
  setState: (patch: any) => void;
  setName: (name: string, versionId: string) => void;
  // setMeta: (meta: Record<string, any>) => void; TODO: remove as obsolete?
  fetchServiceToken: () => Promise<TokenResponse>;
  getConfiguration: () => HostConfiguration;
  getVersions: () => Promise<HostConfiguration[]>;
  createVersion: (name: string, fromId: string) => HostConfiguration;
  getActiveVersionId: () => string;
  setActiveVersionId: (versionId: string) => void;
  deleteVersion: (versionId: string) => void;
}
