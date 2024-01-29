import express, { Request, Response, NextFunction } from 'express';
import { getStockLevels } from './src/services/stockService';
import { getStockLevelsController } from './src/controllers/stockController';

const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware to handle async operations
const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Route for getting stock levels
app.get('/stock-levels/:sku', asyncMiddleware(getStockLevelsController));

// Separate route handler for better organization
async function getStockLevelsRoute(req: Request, res: Response) {
  const { sku } = req.params;
  
  try {
    const stockLevels = await getStockLevels(sku);
    res.json(stockLevels);
  } catch (error) {
    // Handle specific errors if needed
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
