import { Request, Response } from 'express';
import { getStockLevels } from '../src/services/stockService';

export async function getStockLevelsController(req: Request, res: Response): Promise<void> {
  try {
    const sku = req.params.sku;
    const result = await getStockLevels(sku);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });  }
}
