import { Name } from './name';
import { VersionGroupResponse } from './versionGroup';

export interface VersionResponse {
  name: string;
  url: URL;
}

export interface VersionDetailResponse {
  id: number;
  name: string;
  names: Name[];
  version_group: VersionGroupResponse;
}
