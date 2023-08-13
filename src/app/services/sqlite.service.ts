import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions,
  capSQLiteResult,
  capSQLiteValues,
} from '@capacitor-community/sqlite';
import { DBInfoService } from './dbinfo.service';

/**
 * Service for interacting with the SQLite database using Capacitor plugins.
 */
@Injectable({
  providedIn: 'root',
})
export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;

  constructor(private dbInfoService: DBInfoService) {}

  /**
   * Initializes the SQLite plugin and connection.
   * @returns A Promise that resolves to `true` if the plugin was initialized successfully.
   */
  async initializePlugin(): Promise<boolean> {
    this.platform = Capacitor.getPlatform();
    if (this.platform === 'ios' || this.platform === 'android')
      this.native = true;
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    this.isService = true;
    return true;
  }

  /**
   * Initializes the Web Store.
   * @returns A Promise that resolves to `true` if the plugin was initialized successfully.
   */
  async initWebStore(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${err}`);
    }
  }

  /**
   * Opens a database connection and returns the connection object.
   * @param dbName - The name of the database.
   * @param encrypted - Indicates if the database is encrypted.
   * @param mode - The mode to open the database.
   * @param version - The version of the database.
   * @param readonly - Indicates if the connection is readonly.
   * @returns A Promise that resolves to a database connection object.
   */
  async openDatabase(
    dbName: string,
    encrypted: boolean,
    mode: string,
    version: number,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqliteConnection.checkConnectionsConsistency())
      .result;
    let isConn = (await this.sqliteConnection.isConnection(dbName, readonly))
      .result;
    if (retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteConnection.createConnection(
        dbName,
        encrypted,
        mode,
        version,
        readonly
      );
    }
    await db.open();
    return db;
  }

  /**
   * Retrieves an existing database connection.
   * @param dbName - The name of the database.
   * @param readonly - Indicates if the connection is readonly.
   * @returns A Promise that resolves to a database connection object.
   */
  async retrieveConnection(
    dbName: string,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    return await this.sqliteConnection.retrieveConnection(dbName, readonly);
  }

  /**
   * Closes a database connection.
   * @param database - The name of the database to close.
   * @param readonly - Indicates if the connection is readonly.
   * @returns A Promise that resolves when the connection is closed.
   */
  async closeConnection(database: string, readonly?: boolean): Promise<void> {
    const readOnly = readonly ? readonly : false;
    return await this.sqliteConnection.closeConnection(database, readOnly);
  }

  /**
   * Adds an upgrade statement for database version upgrades.
   * @param options - The upgrade options.
   * @returns A Promise that resolves when the upgrade statement is added.
   */
  async addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> {
    await this.sqlitePlugin.addUpgradeStatement(options);
    return;
  }

  /**
   * Checks if database encryption is configured in the app's configuration.
   * @returns A Promise that resolves with the result of the check.
   */
  async isInConfigEncryption(): Promise<capSQLiteResult> {
    return await this.sqliteConnection.isInConfigEncryption();
  }

  /**
   * Checks if biometric authentication is configured in the app's configuration.
   * @returns A Promise that resolves with the result of the check.
   */
  async isInConfigBiometricAuth(): Promise<capSQLiteResult> {
    return await this.sqliteConnection.isInConfigBiometricAuth();
  }

  /**
   * Checks if a database is encrypted.
   * @param database - The name of the database.
   * @returns A Promise that resolves with the result of the check.
   */
  async isDatabaseEncrypted(database: string): Promise<capSQLiteResult> {
    let res: capSQLiteResult = { result: false };
    const isDB = (await this.sqliteConnection.isDatabase(database)).result;
    if (!isDB) {
      return { result: false };
    }
    return await this.sqliteConnection.isDatabaseEncrypted(database);
  }

  /**
   * Checks if the secret for encryption is stored.
   * @returns A Promise that resolves with the result of the check.
   */
  async isSecretStored(): Promise<capSQLiteResult> {
    return await this.sqliteConnection.isSecretStored();
  }

  /**
   * Sets the encryption secret for the database.
   * @param passphrase - The passphrase for encryption.
   * @returns A Promise that resolves when the encryption secret is set.
   */
  async setEncryptionSecret(passphrase: string): Promise<void> {
    return await this.sqliteConnection.setEncryptionSecret(passphrase);
  }

  /**
   * Clears the encryption secret for the database.
   * @returns A Promise that resolves when the encryption secret is cleared.
   */
  async clearEncryptionSecret(): Promise<void> {
    return await this.sqliteConnection.clearEncryptionSecret();
  }

  /**
   * Changes the encryption secret for the database.
   * @param passphrase - The new passphrase for encryption.
   * @param oldpassphrase - The old passphrase for encryption.
   * @returns A Promise that resolves when the encryption secret is changed.
   */
  async changeEncryptionSecret(
    passphrase: string,
    oldpassphrase: string
  ): Promise<void> {
    return await this.sqliteConnection.changeEncryptionSecret(
      passphrase,
      oldpassphrase
    );
  }

  /**
   * Checks the validity of an encryption secret.
   * @param passphrase - The passphrase to check.
   * @returns A Promise that resolves with the result of the check.
   */
  async checkEncryptionSecret(passphrase: string): Promise<capSQLiteResult> {
    return await this.sqliteConnection.checkEncryptionSecret(passphrase);
  }

  /**
   * Retrieves a list of available databases.
   * @returns A Promise that resolves with the list of database names.
   */
  async getDatabaseList(): Promise<capSQLiteValues> {
    return await this.sqliteConnection.getDatabaseList();
  }

  /**
   * Retrieves a single row from a table based on the provided conditions.
   * @param mDb - The database connection.
   * @param table - The name of the table to query.
   * @param where - The conditions to filter the query.
   * @returns A Promise that resolves to the retrieved row, or `null` if not found.
   */
  async findOneBy(
    mDb: SQLiteDBConnection,
    table: string,
    where: any
  ): Promise<any> {
    try {
      const key: string = Object.keys(where)[0];
      const stmt: string = `SELECT * FROM ${table} WHERE ${key}=${where[key]};`;
      const retValues = (await mDb.query(stmt)).values;
      const ret = retValues!.length > 0 ? retValues![0] : null;
      return ret;
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`findOneBy err: ${msg}`);
    }
  }

  /**
   * Saves data to a table. Inserts a new row if no `where` condition is provided, otherwise updates the matching row.
   * @param mDb - The database connection.
   * @param table - The name of the table to insert/update data.
   * @param mObj - The data to be inserted/updated.
   * @param where - Optional conditions to identify the row to update.
   * @returns A Promise that resolves when the data is saved successfully.
   */
  async save(
    mDb: SQLiteDBConnection,
    table: string,
    mObj: any,
    where?: any
  ): Promise<void> {
    const isUpdate: boolean = where ? true : false;
    const keys: string[] = Object.keys(mObj);
    let stmt: string = '';
    let values: any[] = [];
    for (const key of keys) {
      values.push(mObj[key]);
    }
    if (!isUpdate) {
      // INSERT
      const qMarks: string[] = [];
      for (const key of keys) {
        qMarks.push('?');
      }
      stmt = `INSERT INTO ${table} (${keys.toString()}) VALUES (${qMarks.toString()});`;
    } else {
      // UPDATE
      const wKey: string = Object.keys(where)[0];

      const setString: string = await this.setNameForUpdate(keys);
      if (setString.length === 0) {
        return Promise.reject(`save: update no SET`);
      }
      stmt = `UPDATE ${table} SET ${setString} WHERE ${wKey}=${where[wKey]}`;
    }
    const ret = await mDb.run(stmt, values);
    if (ret.changes!.changes != 1) {
      return Promise.reject(`save: insert changes != 1`);
    }
    return;
  }

  /**
   * Decrypts encrypted databases and updates them to unencrypted state.
   * @returns A Promise that resolves when the decryption process is complete.
   */
  async unencryptCryptedDatabases(): Promise<void> {
    const dbList: string[] = (await this.getDatabaseList()).values!;
    for (let idx: number = 0; idx < dbList.length; idx++) {
      const dbName = dbList[idx].split('SQLite.db')[0];
      const isEncrypt = (await this.isDatabaseEncrypted(dbName)).result!;
      if (isEncrypt) {
        const version = this.dbInfoService.getVersion(dbName)!;
        const db = await this.openDatabase(
          dbName,
          true,
          'secret',
          version,
          false
        );
        const jsonDB = (await db.exportToJson('full')).export!;
        jsonDB.overwrite = true;
        jsonDB.encrypted = false;
        const res = await this.sqliteConnection.importFromJson(
          JSON.stringify(jsonDB)
        );
      }
    }
  }

  /**
   * Removes a row from a table based on the provided conditions.
   * @param mDb - The database connection.
   * @param table - The name of the table to delete data from.
   * @param where - The conditions to filter the deletion.
   * @returns A Promise that resolves when the row is deleted successfully.
   */
  async remove(
    mDb: SQLiteDBConnection,
    table: string,
    where: any
  ): Promise<void> {
    const key: string = Object.keys(where)[0];
    const stmt: string = `DELETE FROM ${table} WHERE ${key}=${where[key]};`;
    const ret = await mDb.run(stmt);
    return;
  }

  /**
   * Generates the SET clause string for an SQL UPDATE statement.
   * @param names - The list of column names.
   * @returns A Promise that resolves to the generated SET clause string.
   */
  private async setNameForUpdate(names: string[]): Promise<string> {
    let retString = '';
    for (const name of names) {
      retString += `${name} = ? ,`;
    }
    if (retString.length > 1) {
      retString = retString.slice(0, -1);
      return retString;
    } else {
      return Promise.reject('SetNameForUpdate: length = 0');
    }
  }
}
