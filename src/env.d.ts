declare interface Env {
  readonly ORDO_FIREBASE_CONF;

  readonly ORDO_USERS_COLLETION: string;
  readonly ORDO_PROJECTS_COLLECTION: string;
  readonly ORDO_SECTIONS_COLLECTION: string;
  readonly ORDO_TASKS_COLLECTION: string;

  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}