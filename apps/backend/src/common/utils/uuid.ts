import { v4 as uuidv4 } from "uuid";
class CodeGenerator {
  public generateUniqueCode(): string {
    return uuidv4().replace(/-/g, "").substring(0, 25);
  }

  public generateTaskCode(): string {
    return `task-${uuidv4().replace(/-/g, "").substring(0, 3)}`;
  }

  public generatePrefixedCode(prefix: string, length: number = 8): string {
    if (length < 1 || length > 32) {
      throw new Error("Length must be between 1 and 32");
    }
    return `${prefix}-${uuidv4().replace(/-/g, "").substring(0, length)}`;
  }
}

export const codeGenerator = new CodeGenerator();