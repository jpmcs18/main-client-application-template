export interface Module {
  id: number;
  description: string | undefined;
  route: string | undefined;
  component: string | undefined;
  header: string | undefined;
  checked: boolean | undefined;
  accessId?: number | undefined;
  viewOnly?: boolean | undefined;
}
