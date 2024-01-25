import { getStockLevels } from '../src/services/stockService';
import { readJsonFile } from '../src/utils/readFile';
import { Transaction } from '../src/models/Transaction';
import { Stock } from '../src/models/Stock';

jest.mock('../src/utils/readFile');

describe('getStockLevels', () => {
  const mockReadJsonFile = readJsonFile as jest.Mock;

  afterEach(() => {
    mockReadJsonFile.mockClear();
  });

  it('should return correct stock levels for a valid SKU with various transactions', async () => {
    mockReadJsonFile.mockResolvedValueOnce([{ sku: 'LTV719449/39/39', stock: 8525 }] as Stock[]);
    mockReadJsonFile.mockResolvedValueOnce([{ sku: 'LTV719449/39/39', type: 'order', qty: 5 }] as Transaction[]);

    const result = await getStockLevels('LTV719449/39/39');
    expect(result).toEqual({ sku: 'LTV719449/39/39', qty: 8530 });
  });

  it('should throw an error for a SKU not found in stock.json', async () => {
    mockReadJsonFile.mockResolvedValueOnce([] as Stock[]);
    mockReadJsonFile.mockResolvedValueOnce([] as Transaction[]);

    await expect(getStockLevels('NonExistentSKU')).rejects.toThrow("No data exist for this stock level.");
  });

  it('should throw an error for negative stock quantity', async () => {
    mockReadJsonFile.mockResolvedValueOnce([{ sku: 'LTV719449/39/39', stock: 5 }] as Stock[]);
    mockReadJsonFile.mockResolvedValueOnce([{ sku: 'LTV719449/39/39', type: 'refund', qty: 10 }] as Transaction[]);

    await expect(getStockLevels('LTV719449/39/39')).rejects.toThrow("Negative stock quantity is not allowed.");
  });
});
