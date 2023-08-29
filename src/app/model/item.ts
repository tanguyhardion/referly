export class Item {
  name: string;
  content: string;
  keywords: string[];

  constructor(name: string, content: string, keywords: string[]) {
    this.name = name;
    this.content = content;
    this.keywords = keywords;
  }
}
