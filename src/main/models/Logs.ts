export abstract class Logs<LogType> {
  public _fields: string[];

  private readonly _data: LogType[];

  constructor(data: LogType[]) {
    this._data = data;
  }

  get fields(): string[] {
    return this._fields;
  }

  get data(): LogType[] {
    return this._data;
  }
}
