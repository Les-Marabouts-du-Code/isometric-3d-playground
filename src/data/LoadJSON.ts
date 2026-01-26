export class LoadJSON {
  private _file: string;

  constructor(file: string) {
    this._file = file;
  }

  async load(
    onComplete: (data: JSON) => void,
    onError: (message: string) => void
  ) {
    const data = await fetch(this._file)
      .then(async response => {
        try {
          const dataJSON = await response.json();
          if (dataJSON) {
            onComplete.call(this, dataJSON);
          }
        } catch (e) {
          onError.call(this, 'File parsing error');
        }
      })
      .catch(reject => {
        onError.call(this, 'File not found');
      });
  }
}
