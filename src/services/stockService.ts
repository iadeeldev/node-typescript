import { readJsonFile } from '../utils/readFile';
import { Transaction } from '../models/Transaction';
import { Stock } from '../models/Stock';
import { CompressionStream } from 'stream/web';

export async function getStockLevels(sku: string): Promise<{ sku: string; qty: number }> {
  try {
    const [stockData, transactions] = await Promise.all([
      readJsonFile<Stock[]>('data/stock.json'),
      readJsonFile<Transaction[]>('data/transactions.json'),
    ]);
    if (!Array.isArray(stockData)) {
      return Promise.resolve({ sku, qty: 0, error: `Invalid data for stock in stock.json.` });
    }
    const stock = stockData.find((item) => item.sku === sku);
    if (!stock) {
      return Promise.reject(new Error('No data exist for this stock level.'));
    }
    const transactionQty = transactions
      .filter((transaction) => transaction.sku === sku)
      .reduce((acc, transaction) => acc + (transaction.type === 'order' ? transaction.qty : -transaction.qty), 0);

    const qty = stock.stock + transactionQty;

    if (qty < 0) {
      return Promise.reject(new Error('Negative stock quantity is not allowed.'));
    }

    return { sku, qty };
  } catch (error) {
    throw new Error(`Error fetching stock levels for SKU '${sku}': ${error}`);
  }
}
