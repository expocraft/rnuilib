import { Platform } from 'react-native';
import RNFS from "./RNFSPackage";
const DEFAULT_DYNAMIC_FONTS_FOLDER = '/dynamicFonts';
const DEFAULT_DOWNLOAD_ERROR_MESSAGE = 'An error occurred downloading the file:';
// TODO: this can probably be a more general "downloader" if we so choose
export default class FontDownloader {
  constructor(props) {
    this.props = {
      dynamicFontsFolder: DEFAULT_DYNAMIC_FONTS_FOLDER,
      downloadErrorMessage: DEFAULT_DOWNLOAD_ERROR_MESSAGE,
      ...props
    };
    if (!RNFS) {
      throw new Error(`RNUILib FontDownloader requires installing "react-native-fs" dependency`);
    }
    this.fs = RNFS;
  }
  log(message, ...optionalParams) {
    const {
      debug
    } = this.props;
    if (debug) {
      console.log(message, optionalParams);
    }
  }
  getPrivateFolder() {
    const {
      dynamicFontsFolder
    } = this.props;
    return (Platform.OS === 'android' ? this.fs.ExternalDirectoryPath : this.fs.DocumentDirectoryPath) + dynamicFontsFolder;
  }
  getPrivateFilePath(fileName) {
    return this.getPrivateFolder() + '/' + fileName;
  }
  getFileName(fontName, fontExtension) {
    return fontName + '.' + fontExtension;
  }
  async _isFontDownloaded(fileName) {
    const privateFilePath = this.getPrivateFilePath(fileName);
    return await this.fs.exists(privateFilePath);
  }
  async createPrivateFolderIfNeeded() {
    const privateFolder = this.getPrivateFolder();
    if (!(await this.fs.exists(privateFolder))) {
      await this.fs.mkdir(privateFolder);
    }
  }
  getDownloadFontOptions(fontUri, downloadLocation, readTimeout) {
    const platformSpecificOptions = Platform.OS === 'ios' ? {
      background: false,
      discretionary: true,
      cacheable: false
    } : {
      connectionTimeout: readTimeout
    };
    return {
      fromUrl: fontUri,
      toFile: downloadLocation,
      // TODO: It is possible to add a better progress, maybe for slower networks
      // progress: ({bytesWritten, contentLength}: {bytesWritten: number; contentLength: number}) => {},
      ...platformSpecificOptions,
      fileCache: false,
      readTimeout
    };
  }

  /**
   * Download the font
   * @param fontUri the remote location of the font
   * @param fontName the full name of the font
   * @param fontExtension the extension of the font, i.e. '.ttf' or '.otf'
   * @param timeout a timeout for the download to fail after
   * @returns the full path of the download
   */
  async downloadFont(fontUri, fontName, fontExtension, timeout) {
    const {
      downloadErrorMessage
    } = this.props;
    await this.createPrivateFolderIfNeeded();
    const fileName = this.getFileName(fontName, fontExtension);
    const downloadLocation = this.getPrivateFilePath(fileName);
    try {
      this.log(fontName, 'Starting to download');
      const result = await this.fs.downloadFile(this.getDownloadFontOptions(fontUri, downloadLocation, timeout)).promise;
      if (result.statusCode === 200) {
        this.log(fontName, 'Finished downloading');
        return downloadLocation;
      } else {
        this.log(fontName, 'Error downloading statusCode:', result.statusCode);
        return Promise.reject({
          source: 'uilib:FontDownloader:downloadFont',
          message: `${downloadErrorMessage} fontName: ${fontName} statusCode: ${result.statusCode}`
        });
      }
    } catch (error) {
      this.log(fontName, 'Error downloading error:', error);
      return Promise.reject({
        source: 'uilib:FontDownloader:downloadFont',
        message: `${downloadErrorMessage} fontName: ${fontName} error: ${JSON.stringify(error)}`
      });
    }
  }

  /**
   * Is the font cached (already downloaded)
   * @param {*} fontName the full name of the font
   * @param {*} fontExtension the extension of the font, i.e. '.ttf' or '.otf'
   */
  async isFontDownloaded(fontName, fontExtension) {
    const fileName = this.getFileName(fontName, fontExtension);
    return await this._isFontDownloaded(fileName);
  }
  async readFontFromDisk(fontName, fontExtension) {
    let base64FontString;
    const fileName = this.getFileName(fontName, fontExtension);
    const privateFilePath = this.getPrivateFilePath(fileName);
    if (await this.fs.exists(privateFilePath)) {
      this.log(fontName, 'Starting to read from disk');
      base64FontString = await this.fs.readFile(privateFilePath, 'base64').catch(err => {
        this.log(fontName, 'Failed reading from disk:', err);
      });
      this.log(fontName, 'Finished reading from disk');
    } else {
      this.log(fontName, 'File does not exist (read)');
    }
    return base64FontString;
  }
  async deleteFontFromDisk(fontFullName) {
    const privateFilePath = this.getPrivateFilePath(fontFullName);
    if (await this.fs.exists(privateFilePath)) {
      this.log(fontFullName, 'Starting to delete');
      await this.fs.unlink(privateFilePath).catch(err => {
        this.log(fontFullName, 'Failed deleting:', err);
      });
      this.log(fontFullName, 'Finished deleting');
    } else {
      this.log(fontFullName, 'File does not exist (delete)');
    }
  }
}