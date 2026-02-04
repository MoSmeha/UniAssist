import * as cafeteriaMenuService from "../services/cafeteriaMenu.service.js";

// Get menu for a specific day
export const getMenuByDay = async (req, res) => {
  try {
    const menu = await cafeteriaMenuService.getMenuByDay(req.params.day);
    res.json(menu);
  } catch (err) {
    const statusCode = err.message === "Menu not found" ? 404 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};

// Create new day menu
export const createMenuForDay = async (req, res) => {
  try {
    const menu = await cafeteriaMenuService.createMenuForDay(req.body);
    res.status(201).json(menu);
  } catch (err) {
    const statusCode = err.message === "Menu already exists" ? 400 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};

// Add item to a category
export const addMenuItem = async (req, res) => {
  const { day, category } = req.params;
  try {
    const menu = await cafeteriaMenuService.addMenuItem(day, category, req.body);
    res.status(200).json(menu);
  } catch (err) {
    const statusCode = err.message === "Menu not found" ? 404 : 
                      err.message === "Invalid category" ? 400 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};

// Update item
export const updateMenuItem = async (req, res) => {
  const { day, category, itemId } = req.params;
  try {
    const menu = await cafeteriaMenuService.updateMenuItem(day, category, itemId, req.body);
    res.status(200).json(menu);
  } catch (err) {
    const statusCode = err.message === "Menu not found" || err.message === "Item not found" ? 404 : 
                      err.message.includes("must be a number") ? 400 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};

// Delete item
export const deleteMenuItem = async (req, res) => {
  const { day, category, itemId } = req.params;
  try {
    const menu = await cafeteriaMenuService.deleteMenuItem(day, category, itemId);
    res.status(200).json(menu);
  } catch (err) {
    const statusCode = err.message === "Menu not found" || err.message === "Item not found" ? 404 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};
