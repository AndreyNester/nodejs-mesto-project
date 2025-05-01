import { TErrorName } from "./AppError.interface";

export default class AppError extends Error {
  public readonly name: TErrorName = "Internal Error";

  constructor(name: TErrorName) {
    super();
    this.name = name;
  }
}
